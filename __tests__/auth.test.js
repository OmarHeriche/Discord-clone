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
const redis = require("../db/connect_redis");
//!import :end
const app = createApp(
    redis,
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

describe("the best cases for the auth controllers", () => {
    describe("/api/v1/auth/register <=> create a new user perfect case", () => {
        it("check status = 201", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "omar",
                    email: "omar@gmail.com",
                    password: "password",
                });
            expect(response.status).toBe(201);
        });

        it("check the response.body", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "omar1",
                    email: "omar1@gmail.com",
                    password: "password",
                });
            expect(response.body.success).toBe(true);
            expect(response.body.name).toBe("omar1");
            expect(response.body.userId).toBeDefined();
        });

        it("check the refresh token and the access token in the http only coockies", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "omar3",
                    email: "omar3@gmail.com",
                    password: "password",
                });
            expect(response.headers["set-cookie"]).toBeDefined(); //?check if the cookies are set in the headers of the response
            const cookies = response.headers["set-cookie"]; //?get the cookies from the headers: cookies[0]=accessToken, cookies[1]=refreshToken
            const accessToken = cookies.find((cookie) =>
                cookie.startsWith("accessToken")
            );
            const refreshToken = cookies.find((cookie) =>
                cookie.startsWith("refreshToken")
            );
            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
        });
    });

    describe("/api/v1/auth/login <=> login a user perfect case", () => {
        //!1️⃣create a user :start
        it("check status = 200", async () => {
            await superTest(app).post("/api/v1/auth/register").send({
                userName: "omar1",
                email: "omar1@gmail.com",
                password: "password",
            });
        });
        //!create a user :end
        //?login the created user :start
        it("check status = 200", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "omar1@gmail.com",
                    password: "password",
                });
            expect(response.status).toBe(200);
        });
        it("check status = 200", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "omar1@gmail.com",
                    password: "password",
                });
            expect(response.body.success).toBe(true);
            expect(response.body.name).toBe("omar1");
            expect(response.body.userId).toBeDefined();
        });
        it("check the refresh token and the access token in the http only coockies", async () => {
            const response = await superTest(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "omar1@gmail.com",
                    password: "password",
                });
            expect(response.headers["set-cookie"]).toBeDefined();
            const theArrayOfTwoCookies = response.headers["set-cookie"];
            const accessToken = theArrayOfTwoCookies.find((_) =>
                _.startsWith("accessToken")
            );
            const refreshToken = theArrayOfTwoCookies.find((_) =>
                _.startsWith("refreshToken")
            );
            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
        });
        //?login the created user :end
    });
});
