require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const SessionDataSource = require("./datasources/sessions");
const SpeakerDataSource = require("./datasources/speakers");
const UserDataSource = require("./datasources/users");

const typeDefs = require("./schema.js");
const resolvers = require("./resolvers/index");
const auth = require("./utils/auth");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const dataSources = () => ({
  sessionDataSource: new SessionDataSource(),
  speakerDataSource: new SpeakerDataSource(),
  userDataSource: new UserDataSource(),
});

app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources
});

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => {
  console.log(`graphQL running at port 4000`);
});
