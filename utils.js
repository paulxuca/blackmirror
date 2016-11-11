const Thread = require('./Thread');

module.exports = {
  isNewSession: (threadID) => {
    return new Promise((resolve, reject) => {
      Thread.findOne({ threadID })
        .then((doc) => {
          if (doc) resolve(true);
          resolve(false);
        });
    });
  }
}