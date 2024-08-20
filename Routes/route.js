const express = require("express");
const {
  registration,
  landing,
  Login,
} = require("../Controller/AuthController");
const router = express.Router();

router.get("", landing);

router.post("/register", registration);
router.post("/login", Login);

module.exports = router;
