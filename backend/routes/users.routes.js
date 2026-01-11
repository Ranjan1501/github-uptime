const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserContributions,
  getUserRepositories,
} = require("../controllers/users.controllers");

router.get("/user/:username", getUserProfile);
router.get("/contributions/:username", getUserContributions);
router.get("/repositories/:username", getUserRepositories);

module.exports = router;
