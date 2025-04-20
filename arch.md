#### 1. **User Routes**

* **POST /auth/signup** - Register a new user.
* **POST /auth/login** - Login an existing user.
* **POST /auth/logout** - Logout the user.
* **GET /auth/role-request** - Request a role change (from Reader to Writer).
* **POST /auth/role-approve** - Admin approves a role change (Admin only).
* **GET /auth/role-status** - Check user role status.

#### 2. **Blog Post Routes**

* **POST /posts** - Create a new post (only Writers).
* **GET /posts/:id** - Get a single post.
* **GET /posts** - Get all posts, optionally filtered by categories/tags.
* **PUT /posts/:id** - Update a post (only Writers).
* **DELETE /posts/:id** - Delete a post (only Admins).
* **POST /posts/:id/like** - Like a post.
* **POST /posts/:id/comment** - Comment on a post.
* **POST /posts/:id/report** - Report a post (for violations).

#### 3. **Category Routes**

* **GET /categories** - Get all available categories.
* **POST /categories** - Create a new category (Admin only).
* **PUT /categories/:id** - Update a category (Admin only).
* **DELETE /categories/:id** - Delete a category (Admin only).

#### 4. **Admin Routes**

* **GET /admin/reports** - View all reports of flagged content.
* **POST /admin/ban-user/:id** - Ban a user (Admin only).
* **POST /admin/suspend-user/:id** - Suspend a user for violations (Admin only).

#### 5. **Community Routes**

* **POST /community/bookmark** - Bookmark a post.
* **POST /community/follow-writer/:id** - Follow a writer.
* **POST /community/unfollow-writer/:id** - Unfollow a writer.

---

### Middleware

#### 1. **Auth Middleware**

To verify user authentication and role access:

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};
```

#### 2. **Role Middleware**

To check if the user has a required role:

```js
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};
```

---

### Controllers

#### 1. **AuthController**

* **signup** - Handle new user registrations.
* **login** - Handle user login and JWT token generation.
* **logout** - Handle user logout by invalidating the token.
* **requestRoleChange** - Handle request for role change (Reader → Writer).
* **approveRoleChange** - Admin action to approve role requests.

#### 2. **PostController**

* **createPost** - Create a new blog post.
* **getPost** - Get a specific blog post by ID.
* **getAllPosts** - Retrieve all posts (with optional filters for categories/tags).
* **updatePost** - Update an existing post.
* **deletePost** - Admin-only route to delete posts.
* **likePost** - Like a specific post.
* **commentOnPost** - Add a comment on a post.
* **reportPost** - Report a post for violating terms.

#### 3. **CategoryController**

* **getCategories** - Get all categories available for posts.
* **createCategory** - Create a new category (Admin only).
* **updateCategory** - Update an existing category (Admin only).
* **deleteCategory** - Delete a category (Admin only).

#### 4. **AdminController**

* **viewReports** - Admin views all flagged posts for review.
* **banUser** - Ban a user (for abusive or fake content).
* **suspendUser** - Temporarily suspend a user.

#### 5. **CommunityController**

* **bookmarkPost** - Bookmark a post to read later.
* **followWriter** - Follow a specific writer.
* **unfollowWriter** - Unfollow a specific writer.

---

### Models

#### 1. **User Model**

Contains user information, including role (Reader, Writer, Admin), registration details, and role request status.

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Reader', 'Writer', 'Admin'], default: 'Reader' },
  roleRequestStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  postsWritten: { type: Number, default: 0 },
  lastPostDate: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
```

#### 2. **Post Model**

Represents a blog post, including the title, content, category, and status (draft or published).

```js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Post', postSchema);
```

#### 3. **Report Model**

Represents flagged posts and user reports.

```js
const reportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
```
