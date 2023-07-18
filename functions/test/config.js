const test = require("firebase-functions-test")({
  projectId: process.env.GCLOUD_PROJECT,
});

module.exports = test;