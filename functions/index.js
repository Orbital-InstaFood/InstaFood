const { initializeApp } = require("firebase-admin/app");
initializeApp();

const addUserID = require("./addUserID");
const getListOfUserIDs = require("./getListOfUserIDs");
const makeFollowRequest = require("./makeFollowRequest");
const answerFollowRequest = require("./answerFollowRequest");
const unfollow = require("./unfollow");
const removeFollower = require("./removeFollower");
const makeComment = require("./makeComment");
const deleteComment = require("./deleteComment");

exports.addUserID = addUserID.addUserID;
exports.getListOfUserIDs = getListOfUserIDs.getListOfUserIDs;
exports.makeFollowRequest = makeFollowRequest.makeFollowRequest;
exports.answerFollowRequest = answerFollowRequest.answerFollowRequest;
exports.unfollow = unfollow.unfollow;
exports.removeFollower = removeFollower.removeFollower;
exports.makeComment = makeComment.makeComment;
exports.deleteComment = deleteComment.deleteComment;
