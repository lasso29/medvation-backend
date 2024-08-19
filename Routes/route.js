const express = require("express");
const { landing } = require("../Controller/userController");
const router = express.Router();

router.get("", landing);

module.exports = router;