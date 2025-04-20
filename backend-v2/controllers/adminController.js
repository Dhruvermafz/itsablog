const User = require("../models/user");

exports.approveWriter = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Writer";
    user.trialPhase = true;
    user.trialStart = new Date();
    await user.save();

    res.json({ message: "Writer role approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
