const express = require("express");
const router = express.Router(); // --> initialize express router
const authController = require("./controllers/authController");
const activateController = require("./controllers/activateController");
const authMiddleware = require("./middleware/authMiddleware");
const roomController = require("./controllers/roomController");

router.route("/send-otp").post(authController.sendOTP);
router.route("/verify-otp").post(authController.verifyOTP);
router.route("/activate").post(authMiddleware, activateController.activate);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authMiddleware, authController.logout)
router.route("/rooms").post(authMiddleware, roomController.createRoom)
router.route("/rooms").get(roomController.index);
router.route("/rooms/:roomId").get(authMiddleware, roomController.show);
router.route("/user/:userId").get(authMiddleware, authController.getUser);
router.route("/user/:userId/rooms").get(authMiddleware, roomController.showUserSpecificRoom);


module.exports = router;