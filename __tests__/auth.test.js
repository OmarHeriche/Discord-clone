//!import :start
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
  cookieParcer
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


describe.skip("/api/v1/auth/register", () => {
  it("check register with all the data needed the status", async () => {
    const response = await superTest(app).post("/api/v1/auth/register").send({
      userName: "kanki",
      email: "khil@gmail.com",
      password: "12345o6",
    });
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ success: true, name: "kanki" });
  });
  it("check register with all the data needed the token refreshToken and access token",async()=>{
    const response = await superTest(app).post("/api/v1/auth/register").send({
      userName: "kanki",
      email: "dEmail@gmail.com",
      password: "12345o6",
    });
    expect(response.headers["set-cookie"]).toBeDefined();
    const cookies = response.headers["set-cookie"];
    const accessToken = cookies.find((cookie) =>
      cookie.startsWith("accessToken")
    );
    const refreshToken = cookies.find((cookie) =>
      cookie.startsWith("refreshToken")
    );
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  })
});
