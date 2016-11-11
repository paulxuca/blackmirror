var Document = require('camo').Document;
var User = require('./User');

class Thread extends Document {
  constructor() {
    super();
    this.threadID = String;
    this.users = [User];
  }

  static collectionName() {
    return 'thread';
  }
}

module.exports = Thread;