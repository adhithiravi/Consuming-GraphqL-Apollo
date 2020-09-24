const { DataSource } = require("apollo-datasource");
const lodashId = require("lodash-id");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { groupBy } = require("lodash");

const adapter = new FileSync("./data/speakers.json");
const db = low(adapter);
db._.mixin(lodashId);

class SpeakerDataSource extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.db = db;
  }

  async getSpeakerById(id) {
    return this.db.get("speakers").getById(id).value();
  }

  async getSpeakers(args) {
    const data = this.db.get("speakers").filter(args).value();
    return data;
  }

  async markFeatured(speakerId, featured) {
    const data = this.db.get("speakers").find({ id: speakerId }).assign({ featured }).write();
    return data;
  }
}

module.exports = SpeakerDataSource;
