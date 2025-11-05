const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const morgan = require("morgan");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const email = require("./routes/emailConfirmation");
const category = require("./routes/category");
const notify = require("./routes/notify");
const groups = require("./routes/groups");
const newsroom = require("./routes/newsroom");
const httpServer = require("http").createServer(app);

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = require("socket.io")(httpServer, {
  cors: {
    origins: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://social-app-gilt-one.vercel.app",
      "https://itsablog.vercel.app",
      "https://dhruvermafz.vercel.app",
    ],

    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true,
      });
      res.end();
    },
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("MongoDB connected");
  }
);

httpServer.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server is running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.use("/email", email);
app.use("/api/category", category);
app.use("/api/notify", notify);
app.use("/api/groups", groups);
app.use("/api/newsroom", newsroom);
app.get("/", (req, res) => {
  res.send(`<h3>Hey! ItsABlog Backend is up!</h3>`);
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./static")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./templates/", "api.html"));
  });
}

process.on("unhandledRejection", (err, promise) => {
  console.error(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
