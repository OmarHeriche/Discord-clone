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
require("redis");
//!import :end
const app = createApp(
  express,
  notFound,
  userRouter,
  friendRouter,
  register_login_router,
  groupRouter,
  messageRouter
);

describe("dealing with users controllers", () => {
  it("GET /api/v1/users should return status 200 & the json", async () => {
    const response = await superTest(app).get("/api/v1/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "get all users" });
  });
  it("GET /api/v1/users/:id should return status 200 & the json", async () => {
    const response = await superTest(app).get("/api/v1/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "get user with id 1" });
  });
});
describe("dealing with friends controllers", () => {
  it("GET /api/v1/friends should return status 200 & the json", async () => {
    const response = await superTest(app).get("/api/v1/friends");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "get all friends" });
  });
  it("GET /api/v1/friends/:id should return status 200", async () => {
    const response = await superTest(app).get("/api/v1/friends/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: "get friend with id 1",
    });
  });
  it("POST /api/v1/friends should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/friends");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "add new friend " });
  });
  it("DELETE /api/v1/friends/:id should return status 200", async () => {
    const response = await superTest(app).delete("/api/v1/friends/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: "delete friend with id 1",
    });
  });
});
describe("dealing with auth controllers", () => {
  it("POST /api/v1/auth/register should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/auth/register");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "register" });
  });
  it("POST /api/v1/login should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/auth/login");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "login" });
  });
});
describe("dealing with group controllers", () => {
  it("GET /api/v1/groups should return status 200", async () => {
    const response = await superTest(app).get("/api/v1/groups");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "get all groups" });
  });
  it("GET /api/v1/groups/:id should return status 200", async () => {
    const response = await superTest(app).get("/api/v1/groups/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: "get group with id 1",
    });
  });
  it("POST /api/v1/groups should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/groups");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, msg: "add new group" });
  });
  it("DELETE /api/v1/groups/:id should return status 200", async () => {
    const response = await superTest(app).delete("/api/v1/groups/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: "delete group with id 1",
    });
  });
  it("PUT /api/v1/groups/:id should return status 200", async () => {
    const response = await superTest(app).patch("/api/v1/groups/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: "update group with id 1",
    });
  });
  it("POST /api/v1/groups/:groupId/users/:userId should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/groups/1/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: { msg: "add user to group", groupId: "1", userId: "1" },
    });
  });
  it("DELETE /api/v1/groups/:groupId/users/:userId should return status 200", async () => {
    const response = await superTest(app).delete("/api/v1/groups/1/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      msg: { msg: "delete user from group", groupId: "1", userId: "1" },
    });
  });
});
describe("dealing with message controllers", () => {
  it("GET /api/v1/messages should return status 200", async () => {
    const response = await superTest(app).get("/api/v1/messages");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Messages fetched", data: [] });
  });
  it("POST /api/v1/messages should return status 200", async () => {
    const response = await superTest(app).post("/api/v1/messages");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ msg: "Message created" });
  });
  it("DELETE /api/v1/messages/:id should return status 200", async () => {
    const response = await superTest(app).delete("/api/v1/messages/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({msg:"Message deleted"});
  });
  it("PUT /api/v1/messages/:id should return status 200", async () => {
    const response = await superTest(app).patch("/api/v1/messages/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({msg:"Message updated"});
  });
});
