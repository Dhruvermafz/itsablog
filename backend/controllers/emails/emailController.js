const User = require("../../models/User");
const sendEmail = require("../../util/nodemailer");
const msgs = require("./email.messages");
const templates = require("./emailTemplates");

exports.collectEmail = async (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      // We have a new user! Send them a confirmation email.
      if (!user) {
        User.create({ email })
          .then((newUser) =>
            sendEmail(newUser.email, templates.confirm(newUser._id))
          )
          .then(() => res.json({ msg: msgs.confirm }))
          .catch((err) => console.log(err));
      } else if (user && !user.confirmed) {
        sendEmail(user.email, templates.confirm(user._id)).then(() =>
          res.json({ msg: msgs.resend })
        );
      } else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((err) => console.log(err));
};

exports.confirmEmail = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.json({ msg: msgs.couldNotFind });
      } else if (user && !user.confirmed) {
        User.findByIdAndUpdate(id, { confirmed: true })
          .then(() => res.json({ msg: msgs.confirmed }))
          .catch((err) => console.log(err));
      } else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((err) => console.log(err));
};
