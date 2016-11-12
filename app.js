const login = require('facebook-chat-api');
const modules = require('./modules');
const connect = require('camo').connect;
const Thread = require('./models/Thread');
const User = require('./models/User');
const config = require('./config');
const utils = require('./utils');
const messages = require('./messages');

const votingRegex = new RegExp(/\+\+\s?(.+)/);

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

function handleThreadedVoting(messageData, currentSession, target, action) {
  // First we resolve the target
  const targetUserOrNull = utils.hasUser(target, currentSession);
  if (targetUserOrNull) {
    
  }
}

function handleThreadMessage(messageData, currentSession) {
  const { body } = messageData;
  const target = body.match(votingRegex)[1];
  const action = body.split(target)[0];
  handleThreadedVoting(messageData, currentSession, target, action);
}

async function actionListenerHandler(messageData) {
  // First, check if it's a message thread we've seeen before
  let currentSession;
  let firstThread = false;
  const { threadID } = messageData;

  const hasBeen = await utils.isNewSession(threadID);
  
  if (hasBeen) {
    currentSession = await utils.getThread(threadID);
  } else {
    try {
      firstThread = true;
      let currentSession = await initThread(threadID)
    } catch (saveError) {
      throw new Error(saveError);
    }
  }
  if (firstThread) api.sendMessage(messages.general.initial, threadID);
  handleThreadMessage(messageData, currentSession);
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