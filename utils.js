const Thread = require('./models/Thread');

const normalizeString = (string) => string.toLowerCase().replace(' ', '');

module.exports = {
  isNewSession: (threadID) => {
    return new Promise((resolve, reject) => {
      Thread.findOne({ threadID })
        .then((doc) => {
          if (doc) resolve(true);
          resolve(false);
        });
    });
  },
  getThread: (threadID) => {
    return Thread.findOne({ threadID });
  },
  hasUser: (name, session) => {
    const findingName = normalizeString(name); 
    return session.users.find((eachUser) => {
      return normalizeString(eachUser.name) === findingName || normalizeString(eachUser.fullName) === findingName;
    });
  }
}