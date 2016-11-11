const login = require('facebook-chat-api');
const config = require('./config');

module.exports = {
  loginToFacebook: () => {
    return new Promise((resolve, reject) => {
        const { email, password } = config;
        login({ email, password }, (err, api) => {
        if (err) reject(err);
        resolve(api);
      });
    });
  },
  getThreadInfo: (api, id) => {
    return new Promise((resolve, reject) => {
      api.getThreadInfo(id, (err, info) => {
        if (err) reject(err);
        resolve(info);
      })
    });
  },
  getUserInfos: (api, ids) => {
    return new Promise((resolve, reject) => {
      api.getUserInfo(ids, (err, obj) => {
        if(err) reject(err);
        resolve(obj);
      });
    });
  }
}