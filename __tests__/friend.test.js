//!import :start
const refreshToken = require("../middleware/refreshToken");
const express = require("express");
const notFound = require("../middleware/notFound");
const userRouter = require("../routes/user");
const friendRouter = require("../routes/friend");
const register_login_router = require("../routes/auth");
const groupRouter = require("../routes/group");
const messageRouter = require("../routes/message");
require("dotenv").config();
require("express-async-errors");
const superTest = require("supertest");
const createApp = require("../app");
const cookieParcer = require("cookie-parser");
const auth = require("../middleware/authentication");
const connectDB = require("../db/connect");
require("redis");
//?in memory instance of the mongodb:start
const { MongoMemoryServer } = require("mongodb-memory-server"); //todo 🫡🫡🫡🫡🫡🫡🫡🫡🫡🫡🫡🫡
const mongoose = require("mongoose");
//?in memory instance of the mongodb:end
//!import :end
const app = createApp(
    express,
    notFound,
    userRouter,
    friendRouter,
    register_login_router,
    groupRouter,
    messageRouter,
    auth,
    cookieParcer,
    refreshToken
);

beforeAll(async () => {
    const createServer = await MongoMemoryServer.create();
    const uri = createServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});

