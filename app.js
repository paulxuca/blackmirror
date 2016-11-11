const login = require('facebook-chat-api');
const modules = require('./modules');
const connect = require('camo').connect;
const Thread = require('./Thread');
const User = require('./User');
const config = require('./config');
const utils = require('./utils');
const messages = require('./messages');

let api;
let db;

async function initThread(threadID) {
  try {
    const newSession = Thread.create({ threadID });

    const newThread = await modules.getThreadInfo(api, threadID);
    const threadUsers = await modules.getUserInfos(api, newThread.participantIDs);
    const users = Object.keys(threadUsers).map(key => threadUsers[key]);
    
    users.forEach((eachParticipants) => {
      console.log(eachParticipants);
      newSession.users.push(User.create({
        belongsToThread: threadID,
        fullName: eachParticipants.name,
        name: eachParticipants.firstName
      }));
    });
    
    const createdSession = await newSession.save();
    return createdSession;
  } catch (initThreadError) {
    console.log(initThreadError);
  }
}

async function actionListenerHandler(messageData) {
  // First, check if it's a message thread we've seeen before
  let currentSession;
  let firstThread = false;
  const hasBeen = await utils.isNewSession(messageData.threadID);
  if (hasBeen) {
    currentSession = await Thread.findOne({ id: messageData.threadID });
  } else {
    try {
      firstThread = true;
      let currentSession = await initThread(messageData.threadID)
    } catch (saveError) {
      throw new Error(saveError);
    }
  }
  if (firstThread) api.sendMessage(messages.general.initial, messageData.threadID);
  api.sendMessage(messageData.body, messageData.threadID);
}

function initListeners() {
  return api.listen((err, message) => {
    actionListenerHandler(message, api);
  });
}

async function init() {
  try {
    api = await modules.loginToFacebook();
    db = await connect(config.mongodev);
    await initListeners();
  } catch (loginError) {
    throw new Error(loginError);
  }
}

init();