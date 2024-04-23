//!import :start
const refreshToken = require("../middleware/refreshToken");
const jwt = require("jsonwebtoken");
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
const e = require("express");
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

describe("testing the perfect cases 🔴 the user is logged in && 🔴 the recipient is exist", () => {
    describe("testing the  /api/v1/message/:recipientId => createMessage", () => {
        it("should return status 201", async () => {
            //?create the sender user:start
            await superTest(app).post("/api/v1/register").send({
                userName: "send",
                email: "send@gmail.com",
                password: "password",
            });
            const recipient = await superTest(app).post("/api/v1/register").send({
                userName: "get",
                email: "get@gmail.com",
                password: "password",
            });
            console.log("🔴🔴🔴🔴🔴🔴",recipient.body);
            await superTest(app).post("/api/v1/login").send({
                email: "send@gmail.com",
                password: "password",
            });
            //?create the sender user:end
            //?send the message to the recipient:start
            // const response = await superTest(app).post(`/api/v1/message/${recipient.body.data._id}`).send({
            //     messageContent: "hi",
            // });
            //?send the message to the recipient:end
        });
    });
});
