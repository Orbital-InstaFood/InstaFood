const { initializeApp } = require("firebase-admin/app");
initializeApp();

const addUserID = require("./addUserID");
const getListOfUserIDs = require("./getListOfUserIDs");
const makeFollowRequest = require("./makeFollowRequest");

exports.addUserID = addUserID.addUserID;
exports.getListOfUserIDs = getListOfUserIDs.getListOfUserIDs;
exports.makeFollowRequest = makeFollowRequest.makeFollowRequest;