const emailController = require("../controllers/emails/emailController");
const express = require("express");
const router = express.Router();

router.post("/", emailController.collectEmail);
router.get("/confirm/:id", emailController.confirmEmail);

module.exports = router;
