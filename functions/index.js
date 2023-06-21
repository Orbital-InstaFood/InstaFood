const { initializeApp } = require("firebase-admin/app");
initializeApp();

const makeFollowRequest = require("./makeFollowRequest");
const answerFollowRequest = require("./answerFollowRequest");
const unfollow = require("./unfollow");
const removeFollower = require("./removeFollower");
const makeComment = require("./makeComment");
const deleteComment = require("./deleteComment");
const likePost = require("./likePost");
const unlikePost = require("./unlikePost");
const infoUserCanView = require("./infoUserCanView");
const addPostToFollowersToView = require("./addPostToFollowersToView");
const createUserProfile = require("./createUserProfile");
const rankPosts = require("./rankPosts");

exports.makeFollowRequest = makeFollowRequest.makeFollowRequest;
exports.answerFollowRequest = answerFollowRequest.answerFollowRequest;
exports.unfollow = unfollow.unfollow;
exports.removeFollower = removeFollower.removeFollower;
exports.makeComment = makeComment.makeComment;
exports.deleteComment = deleteComment.deleteComment;
exports.likePost = likePost.likePost;
exports.unlikePost = unlikePost.unlikePost;
exports.infoUserCanView = infoUserCanView.infoUserCanView;
exports.addPostToFollowersToView = addPostToFollowersToView.addPostToFollowersToView;
exports.createUserProfile = createUserProfile.createUserProfile;
exports.rankPosts = rankPosts.rankPosts;
