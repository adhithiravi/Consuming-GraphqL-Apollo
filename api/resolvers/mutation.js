const authUtils = require("../utils/auth");

module.exports = {
  createSession: async (parent, args, { dataSources }, info) => {
    const session = await dataSources.sessionDataSource.createSession(
      args.session
    );
    return session;
  },
  signUp: async (parent, { credentials }, { dataSources, res }, info) => {
    const { email, password } = credentials;
    const userCredentials = { email: email.toLowerCase(), password };

    const existingUser = dataSources.userDataSource.getUserByEmail(
      userCredentials.email
    );

    if (existingUser) {
      throw new Error("A user account with that email already exists.");
    }

    const hash = authUtils.hashPassword(userCredentials.password);

    const dbUser = dataSources.userDataSource.createUser({
      email: userCredentials.email,
      hash,
    });

    const token = authUtils.createToken(dbUser);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
      },
    };
  },
  signIn: async (parent, { credentials }, { dataSources, res }, info) => {
    const { email, password } = credentials;
    const userCredentials = { email: email.toLowerCase(), password };

    const existingUser = dataSources.userDataSource.getUserByEmail(
      userCredentials.email
    );

    if (!existingUser) {
      throw new Error("Incorrect email address or password.");
    }

    const isValidPassword = authUtils.verifyPassword(
      password,
      existingUser.hash
    );

    if (!isValidPassword) {
      throw new Error("Incorrect email address or password.");
    }

    const token = authUtils.createToken(existingUser);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return {
      user: {
        id: existingUser.id,
        email: existingUser.email,
      },
    };
  },
  userInfo: async (parent, args, { dataSources, user }, info) => {
    if (user) {
      return {
        user: { id: user.sub, email: user.email },
      };
    }

    return {
      user: undefined,
    };
  },
  signOut: async (parent, args, { dataSources, res }, info) => {
    res.clearCookie("token");
    return {
      user: undefined,
    };
  },
  toggleFavoriteSession: async (parent, args, context, info) => {
    if (context.user) {
      const user = await context.dataSources.userDataSource.toggleFavoriteSession(
        args.sessionId,
        context.user.sub
      );
      return user;
    }
    return undefined;
  },
  markFeatured: async (parent, args, { dataSources }, info) => {
    return dataSources.speakerDataSource.markFeatured(
      args.speakerId,
      args.featured
    );
  },
};
