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
const recipient = {
    userName: "get",
    email: "get@gmail.com",
    password: "password",
    _id: new mongoose.Types.ObjectId().toString()
};
describe("testing the perfect cases 🔴 the user is logged in && 🔴 the recipient is exist", () => {
    describe("testing the  /api/v1/message/:recipientId => createMessage", () => {
        it("should return status 201 && res.body = success=true , data = message", async () => {
            //?create the sender user:start
            const sender = await superTest(app).post("/api/v1/auth/register").send({
                userName: "send",
                email: "send@gmail.com",
                password: "password",
            });
            //?create the sender user:end

            //?get cookies :start
            const cookies = sender.headers["set-cookie"];
            //?get cookies :end

            //?send the message to the recipient:start
            const response = await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "hello ricipient im the sender",
            }).set("cookie", cookies);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.messageContent).toBe("hello ricipient im the sender");
            //?send the message to the recipient:end
        });
    });
    describe("testing the  /api/v1/message/:recipientId => getAllMessages", () => {
        it("should return status 200 && res.body = success=true , data = messages", async () => {
            //?create the sender user:start
            const sender = await superTest(app).post("/api/v1/auth/register").send({
                userName: "send1",
                email: "send1@gmail.com",
                password: "password",
            });
            //?create the sender user:end

            //?get cookies :start
            const cookies = sender.headers["set-cookie"];
            //?get cookies :end

            //?send the messages to the recipient:start
            await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "first message",
            }).set("cookie", cookies);
            await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "second message",
            }).set("cookie", cookies);
            await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "third message",
            }).set("cookie", cookies);
            //?send the messages to the recipient:end


            const response = await superTest(app).get(`/api/v1/messages/${recipient._id}`).set("cookie", cookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data[0].messageContent).toBe("first message");
            expect(response.body.data[1].messageContent).toBe("second message");
            expect(response.body.data[2].messageContent).toBe("third message");
            //?send the message to the recipient:end
        });
    });

    describe("/api/v1/message/:recipientId/:messageId => updateMessage", () => {
        it("should return status = 200",async ()=>{

            //?create the sender user: start
            const sender = await superTest(app).post("/api/v1/auth/register").send({
                userName: "send2",
                email: "send2@gmail.com",
                password: "password",
            });
            //?create the sender user: end

            //?get cookies : start
            const cookies = sender.headers["set-cookie"];
            //?get cookies : end

            const theCreatedMessage = await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "first message",
            }).set("cookie", cookies);


            const theUpdatedMessage = await superTest(app).patch(`/api/v1/messages/${recipient._id}/${theCreatedMessage.body.data._id}`).send({
                messageContent: "the updated message",
            }).set("cookie", cookies);

            expect(theUpdatedMessage.status).toBe(200);
            expect(theUpdatedMessage.body.data.messageContent).toBe("the updated message");
        })
    });
    describe("/api/v1/message/:recipientId/:messageId => delete", () => {
        it("should return status = 200",async ()=>{

            //?create the sender user: start
            const sender = await superTest(app).post("/api/v1/auth/register").send({
                userName: "send3",
                email: "send3@gmail.com",
                password: "password",
            });
            //?create the sender user: end

            //?get cookies : start
            const cookies = sender.headers["set-cookie"];
            //?get cookies : end

            const theCreatedMessage = await superTest(app).post(`/api/v1/messages/${recipient._id}`).send({
                messageContent: "first message",
            }).set("cookie", cookies);


            const deletedMessage = await superTest(app).delete(`/api/v1/messages/${recipient._id}/${theCreatedMessage.body.data._id}`).set("cookie", cookies);
            expect(deletedMessage.status).toBe(200);
            expect(deletedMessage.body.success).toBe(true);
            expect(deletedMessage.body.data._id).toStrictEqual(theCreatedMessage.body.data._id);
        })
    });
});
//todo set the list of the others controllers ⬇️ 