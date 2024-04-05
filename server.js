//!import :start
const express = require("express");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const userRouter = require("./routes/user");
const friendRouter = require("./routes/friend");
const register_login_router = require("./routes/auth");
const groupRouter = require("./routes/group");
const messageRouter = require("./routes/message");
require("dotenv").config();
require("express-async-errors");

//!import :end

const createApp = require('./app');
const app = createApp(express,notFound,userRouter,friendRouter,register_login_router,groupRouter,messageRouter);
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
