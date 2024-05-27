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

describe("test only best cases here", () => {
    describe("/api/v1/friends => getAllFriends", () => {
        it("should return status 200 and the friends of the main user", async () => {
            //todo before each :start
            //?create the 3 users:start
            const user1 = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "user1",
                    email: "user1@gmail.com",
                    password: "password",
                });
            const user2 = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "user2",
                    email: "user2@gmail.com",
                    password: "password",
                });
            const user3 = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "user3",
                    email: "user3@gmail.com",
                    password: "password",
                });
            //?create the 3 users:end
            //?create the main user : start
            const mainUser = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "mainUser",
                    email: "mainUser@gmail.com",
                    password: "password",
                });
            const cookies = mainUser.headers["set-cookie"];
            //?create the main user : end
            //!add 2 users as friends to the main user :start
            await superTest(app)
                .post(`/api/v1/users/${user1.body.userId}`)
                .set("cookie", cookies);
            await superTest(app)
                .post(`/api/v1/users/${user2.body.userId}`)
                .set("cookie", cookies);
            //!add 2 users as friends to the main user :end
            //todo before each :end
            const responce = await superTest(app)
                .get("/api/v1/friends")
                .set("cookie", cookies);
            expect(responce.status).toBe(200);
            expect(responce.body.success).toBe(true);
            expect(responce.body.data.length).toBe(2);
            expect(responce.body.data[0].userName).toBe("user1");
            expect(responce.body.data[1].userName).toBe("user2");
        });
    });
    describe("/api/v1/friends => getSingleFriend", () => {
        it("should return status 200 and the friend of the main user", async () => {
            const mainUser = await superTest(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "mainUser@gmail.com",
                    password: "password",
                });

            const cookies = mainUser.headers["set-cookie"];
            const allFriends = await superTest(app)
                .get("/api/v1/friends")
                .set("cookie", cookies);

            const responce = await superTest(app)
                .get(`/api/v1/friends/${allFriends.body.data[0]._id}`)
                .set("cookie", cookies);
            expect(responce.status).toBe(200);
            expect(responce.body.success).toBe(true);
            expect(responce.body.friendInfos).toEqual(allFriends.body.data[0]);
        });
    });
    describe("/api/v1/friends => delteFriend", () => {
        it("should return status 200 and the friend of the main user", async () => {
            const mainUser = await superTest(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "mainUser@gmail.com",
                    password: "password",
                });

            const cookies = mainUser.headers["set-cookie"];

            let allFriends = await superTest(app)
                .get("/api/v1/friends")
                .set("cookie", cookies);

            //?delete the first friend of the main user
            let relationId = await superTest(app)
                .get(`/api/v1/friends/${allFriends.body.data[0]._id}`)
                .set("cookie", cookies);
            relationId = relationId.body.relationInfos._id;
            const responce = await superTest(app)
                .delete(
                    `/api/v1/friends/${allFriends.body.data[0]._id}/${relationId}`
                )
                .set("cookie", cookies);
            expect(responce.status).toBe(200);
            expect(responce.body.success).toBe(true);
            expect(responce.body.msg).toBe(
                `friend with id ${allFriends.body.data[0]._id} deleted`
            );
            allFriends = await superTest(app)
                .get("/api/v1/friends")
                .set("cookie", cookies);
            expect(allFriends.body.data.length).toBe(1);
        });
    });
});
