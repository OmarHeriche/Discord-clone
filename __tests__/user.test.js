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

beforeEach(async()=>{
    //?create the 3 users:start
    await superTest(app).post("/api/v1/auth/register").send({
        userName: "user1",
        email: "user1@gmail.com",
        password: "password",
    })
    await superTest(app).post("/api/v1/auth/register").send({
        userName: "user2",
        email: "user2@gmail.com",
        password: "password",
    })
    await superTest(app).post("/api/v1/auth/register").send({
        userName: "user3",
        email: "user3@gmail.com",
        password: "password",
    })
    //?create the 3 users:end
})

describe("/api/v1/users => getAllUsers",()=>{
    it("test the best cases only",async()=>{
        const currentUser = await superTest(app).post("/api/v1/auth/register").send({
            userName: "omar",
            email: "omar@gmail.com",
            password: "password",
        });

        const cookies = currentUser.headers["set-cookie"];

        const res = await superTest(app).get("/api/v1/users").set("cookie",cookies);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true)
        expect(res.body.numberOfUsers).toBe(4);
        expect(res.body.data[0].password.length>8).toBe(true);//?the password should be hashed if the length is more than 8"the length of the unhashed password is 8"
        expect(res.body.data[1].password.length>8).toBe(true);//?the password should be hashed if the length is more than 8"the length of the unhashed password is 8"
        expect(res.body.data[2].password.length>8).toBe(true);//?the password should be hashed if the length is more than 8"the length of the unhashed password is 8"
        expect(res.body.data[3].password.length>8).toBe(true);//?the password should be hashed if the length is more than 8"the length of the unhashed password is 8"
    });
})

describe("/api/v1/users/:userId => getSingleUser",()=>{
    it("test the best cases only",async()=>{
        const currentUser = await superTest(app).post("/api/v1/auth/register/").send({
            userName: "omarHeriche",
            email: "omarHeriche@gmail.com",
            password: "password",
        });

        const cookies = currentUser.headers["set-cookie"];

        const res = await superTest(app).get("/api/v1/users").set("cookie",cookies);
        const singleUser0_id = res.body.data[0]._id;
        
        const res2 = await superTest(app).get(`/api/v1/users/${singleUser0_id}`).set("cookie",cookies);
        expect(res2.status).toBe(200);
        expect(res2.body.success).toBe(true);
        expect(res2.body.data.userName).toBe("omar");
        expect(res2.body.data.password.length>8).toBe(true);//?the password should be hashed if the length is more than 8"the length of the unhashed password is 8"
    });
})

describe("/api/v1/users/:userId => addFriend",()=>{
    it("test the best cases only",async()=>{
        const currentUser = await superTest(app).post("/api/v1/auth/register/").send({
            userName: "omarHeriche1",
            email: "omarHeriche1@gmail.com",
            password: "password",
        });

        const cookies = currentUser.headers["set-cookie"];

        const res = await superTest(app).get("/api/v1/users").set("cookie",cookies);
        const singleUser0_id = res.body.data[0]._id;
        
        const res2 = await superTest(app).post(`/api/v1/users/${singleUser0_id}`).set("cookie",cookies);
        expect(res2.status).toBe(201);
        expect(res2.body.success).toBe(true);
        expect(res2.body.data.friendID).toBe(singleUser0_id);
        accessToken = cookies[0].split(";")[0].split("=")[1];
        const payload = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        expect(res2.body.data.userID).toBe(payload.userId);//! hadi haja for bzzaf 🤌🤌🤌🤌🤌🤌
    });
}) 



