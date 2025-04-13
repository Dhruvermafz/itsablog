const router = require("express").Router();
const notifyCtrl = require("../controllers/notifyController");
const { verifyToken } = require("../middleware/auth");

router.post("/notify", verifyToken, notifyCtrl.createNotify);

router.delete("/notify/:id", verifyToken, notifyCtrl.removeNotify);

router.get("/notifies", verifyToken, notifyCtrl.getNotifies);

router.patch("/isReadNotify/:id", verifyToken, notifyCtrl.isReadNotify);

router.delete("/deleteAllNotify", verifyToken, notifyCtrl.deleteAllNotifies);

module.exports = router;
