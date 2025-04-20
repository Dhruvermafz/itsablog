const express = require("express");
const router = express.Router();
const { approveWriter } = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/approve-writer", auth(["Admin"]), approveWriter);

module.exports = router;
