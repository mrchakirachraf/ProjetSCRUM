const express = require("express");
const router = express.Router();
const userController = require("../controllers/userInfo.controller");

router.post("/infoUser", userController.completeProfile);

module.exports = router;
