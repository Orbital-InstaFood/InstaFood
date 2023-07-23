const { initializeApp } = require("firebase-admin/app");
initializeApp();

const addPostToFollowersToView = require("./addPostToFollowersToView");
const answerFollowRequest = require("./answerFollowRequest");
const createUserProfile = require("./createUserProfile");
const deleteComment = require("./deleteComment");
const followPublicUser = require("./followPublicUser");
const infoUserCanView = require("./infoUserCanView");
const likePost = require("./likePost");
const makeComment = require("./makeComment");
const makeFollowRequest = require("./makeFollowRequest");
const notifyFollowersAboutNewEvent = require("./notifyFollowersAboutNewEvent");
const removeFollower = require("./removeFollower");
const unfollow = require("./unfollow");
const unlikePost = require("./unlikePost");

exports.addPostToFollowersToView = addPostToFollowersToView.addPostToFollowersToView;
exports.answerFollowRequest = answerFollowRequest.answerFollowRequest;
exports.createUserProfile = createUserProfile.createUserProfile;
exports.deleteComment = deleteComment.deleteComment;
exports.followPublicUser = followPublicUser.followPublicUser;
exports.infoUserCanView = infoUserCanView.infoUserCanView;
exports.likePost = likePost.likePost;
exports.makeComment = makeComment.makeComment;
exports.makeFollowRequest = makeFollowRequest.makeFollowRequest;
exports.removeFollower = removeFollower.removeFollower;
exports.unfollow = unfollow.unfollow;
exports.unlikePost = unlikePost.unlikePost;
exports.notifyFollowersAboutNewEvent = notifyFollowersAboutNewEvent.notifyFollowersAboutNewEvent;


