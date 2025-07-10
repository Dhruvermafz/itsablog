const CLIENT_ORIGIN = "http://localhost:4000"; // Use consistent variable naming

module.exports = {
  // Confirmation Email (Original)
  confirm: (id) => ({
    subject: "ItsABlog Confirmation Email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to ItsABlog!</h2>
        <p>Thank you for signing up. Please confirm your email address to activate your account.</p>
        <a href="${CLIENT_ORIGIN}/confirm/${id}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Confirm Your Email
        </a>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${CLIENT_ORIGIN}/confirm/${id}">${CLIENT_ORIGIN}/confirm/${id}</a></p>
      </div>
    `,
    text: `Welcome to ItsABlog! Please confirm your email address by copying and pasting this link into your browser: ${CLIENT_ORIGIN}/confirm/${id}`,
  }),

  // Password Reset Email
  resetPassword: (id, token) => ({
    subject: "ItsABlog Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password for ItsABlog. Click the button below to set a new password.</p>
        <a href="${CLIENT_ORIGIN}/reset-password/${id}/${token}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #dc3545; text-decoration: none; border-radius: 5px;">
          Reset Your Password
        </a>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${CLIENT_ORIGIN}/reset-password/${id}/${token}">${CLIENT_ORIGIN}/reset-password/${id}/${token}</a></p>
        <p>This link will expire in 24 hours. If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
    text: `ItsABlog Password Reset Request: Please reset your password by copying and pasting this link into your browser: ${CLIENT_ORIGIN}/reset-password/${id}/${token}. This link will expire in 24 hours. If you did not request a password reset, ignore this email.`,
  }),

  // Welcome Email (After Confirmation)
  welcome: (username) => ({
    subject: "Welcome to ItsABlog!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello, ${username}!</h2>
        <p>Welcome to ItsABlog! Your account has been successfully confirmed.</p>
        <p>Start exploring our community, share your thoughts, and connect with other users by creating your first post.</p>
        <a href="${CLIENT_ORIGIN}/create-post" style="display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;">
          Create Your First Post
        </a>
        <p>Visit our platform: <a href="${CLIENT_ORIGIN}">${CLIENT_ORIGIN}</a></p>
      </div>
    `,
    text: `Hello, ${username}! Welcome to ItsABlog! Your account has been confirmed. Start exploring and share your thoughts by creating your first post: ${CLIENT_ORIGIN}/create-post`,
  }),

  // Post Approval Email (For Admins or Moderators)
  postApproval: (username, postTitle, postId) => ({
    subject: "Your Post Has Been Approved on ItsABlog",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Congratulations, ${username}!</h2>
        <p>Your post titled "<strong>${postTitle}</strong>" has been approved and is now live on ItsABlog.</p>
        <a href="${CLIENT_ORIGIN}/posts/${postId}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #17a2b8; text-decoration: none; border-radius: 5px;">
          View Your Post
        </a>
        <p>Share your post with the community and engage with your readers!</p>
      </div>
    `,
    text: `Congratulations, ${username}! Your post titled "${postTitle}" has been approved and is live on ItsABlog. View it here: ${CLIENT_ORIGIN}/posts/${postId}`,
  }),

  // New Comment Notification
  newComment: (username, postTitle, postId, commenter) => ({
    subject: "New Comment on Your Post",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi, ${username}!</h2>
        <p>${commenter} has commented on your post titled "<strong>${postTitle}</strong>".</p>
        <a href="${CLIENT_ORIGIN}/posts/${postId}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #ffc107; text-decoration: none; border-radius: 5px;">
          View Comment
        </a>
        <p>Check it out and join the conversation!</p>
      </div>
    `,
    text: `Hi, ${username}! ${commenter} has commented on your post "${postTitle}". View it here: ${CLIENT_ORIGIN}/posts/${postId}`,
  }),

  // Post Like Notification
  postLike: (username, postTitle, postId, liker) => ({
    subject: "Someone Liked Your Post on ItsABlog",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi, ${username}!</h2>
        <p>${liker} liked your post titled "<strong>${postTitle}</strong>".</p>
        <a href="${CLIENT_ORIGIN}/posts/${postId}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #6f42c1; text-decoration: none; border-radius: 5px;">
          View Your Post
        </a>
        <p>Keep sharing your amazing content!</p>
      </div>
    `,
    text: `Hi, ${username}! ${liker} liked your post "${postTitle}". View it here: ${CLIENT_ORIGIN}/posts/${postId}`,
  }),

  // Account Deletion Confirmation
  accountDeletion: (username) => ({
    subject: "ItsABlog Account Deletion Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Goodbye, ${username}</h2>
        <p>Your ItsABlog account has been successfully deleted.</p>
        <p>We’re sorry to see you go. If you change your mind, you’re welcome to create a new account anytime at <a href="${CLIENT_ORIGIN}">${CLIENT_ORIGIN}</a>.</p>
        <p>If this was a mistake, please contact our support team immediately.</p>
      </div>
    `,
    text: `Goodbye, ${username}. Your ItsABlog account has been deleted. If you change your mind, create a new account at ${CLIENT_ORIGIN}. Contact support if this was a mistake.`,
  }),
};
