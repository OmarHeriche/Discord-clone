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

const message = {
  createdBy: "660f61a6bf4e2735ec49f9ae",
  recipientId: "660f61a6bf4e2735ec49f9ae",
  messageContent: "hello world",
};

describe.skip("/api/v1/messages regular cases", () => {
  describe("create a message", () => {
    it("should create a message", async () => {
      await superTest(app).post("/api/v1/auth/register").send({
        userName: "kanki",
        email: "khiul@gmail.com",
        password: "12345o6",
      });
      app.use(auth);
      const response = await superTest(app)
        .post(`/api/v1/messages/:${message.recipientId}`)
        .send({
          messageContent: "hello world",
        })
      expect(response.status).toBe(201);
    });
    it.skip("should create a message", async () => {
      const response = await superTest(app)
        .post(`/api/v1/messages/:${message.recipientId}`)
        .send({
          messageContent: "hello world",
        })
      expect(response.body.msg).toBe("Message created");
    });
  });
});
