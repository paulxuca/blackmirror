const EmbeddedDocument = require('camo').EmbeddedDocument;

class User extends EmbeddedDocument {
  constructor() {
    super();
    this.belongsToThread = String;
    this.fullName = String;
    this.name = String;
    this.score = {
      type: Number,
      default: 0,
    };
  }

  static collectionName() {
    return 'user';
  }
}

module.exports = User;