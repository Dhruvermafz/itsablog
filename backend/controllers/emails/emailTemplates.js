const { CLIENT_ORIGIN } = "http://localhost/4000";

module.exports = {
  confirm: (id) => ({
    subject: "ItsABlog Confirmation Email",
    html: `
      <a href='${CLIENT_ORIGIN}/confirm/${id}'>
        Click on the link to Confirm.
      </a>
    `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}`,
  }),
};
