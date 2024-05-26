//!import :start
const cookieParcer = require("cookie-parser");
const express = require("express");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const userRouter = require("./routes/user");
const friendRouter = require("./routes/friend");
const register_login_router = require("./routes/auth");
const groupRouter = require("./routes/group");
const messageRouter = require("./routes/message");
const auth = require("./middleware/authentication");
const refreshToken = require("./middleware/refreshToken");
require("dotenv").config();
require("express-async-errors");
const createApp = require('./app');
//!import :end


const app = createApp(express,notFound,userRouter,friendRouter,register_login_router,groupRouter,messageRouter,auth,cookieParcer,refreshToken);
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}  💻`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
