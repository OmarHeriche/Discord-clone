//!import :start
const UserGroup = require("../models/user_group");
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

describe("test only the best cases here", () => {
    describe("/api/v1/groups => addGroup the best cases", () => {
        it("should return 201 status code and the new group", async () => {
            //!create a user
            const user1 = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "user1",
                    email: "user1@gmail.com",
                    password: "password",
                });
            const cookies = user1.headers["set-cookie"];

            //!create a group
            const group1 = await superTest(app)
                .post("/api/v1/groups")
                .send({
                    groupName: "group1",
                })
                .set("Cookie", cookies);

            //!check if the group is created
            expect(group1.status).toBe(201);
            expect(group1.body.success).toBe(true);
            expect(group1.body.data.groupName).toBe("group1");

            //!check if the user is the admin of the group and the relation user_group is created
            const group1ID = group1.body.data._id;
            const user1ID = user1.body.userId;
            const relation_userGroup = await UserGroup.findOne({
                userID: user1ID,
                groupID: group1ID,
            });
            expect(relation_userGroup.role).toBe("admin");
        });
    });
    describe("api/v1/groups => addUserToGroup i'm admin && user is existe", () => {
        it("should return 201 status code and the new relation user_group", async () => {
            //!log in the previous user
            const user1 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user1@gmail.com",
                password: "password",
            });
            const cookies1 = user1.headers["set-cookie"];
            //!create second user
            const user2 = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    userName: "user2",
                    email: "user2@gmail.com",
                    password: "password",
                });
            const cookies2 = user2.headers["set-cookie"];
            //!create group1 for user1
            const group1 = await superTest(app)
                .post("/api/v1/groups")
                .send({
                    groupName: "group1",
                })
                .set("Cookie", cookies1);
            //!add user2 to group1
            const group1ID = group1.body.data._id;
            const relation_userGroup = await superTest(app)
                .post(`/api/v1/groups/${group1ID}/members/${user2.body.userId}`)
                .set("Cookie", cookies1);
            //!check if the relation user_group is created
            expect(relation_userGroup.status).toBe(201);
            expect(relation_userGroup.body.success).toBe(true);
            //!check if user1 is in the group1 and the role is admin
            const user1_group1 = await UserGroup.findOne({
                userID: user1.body.userId,
                groupID: group1ID,
            });
            expect(user1_group1.role).toBe("admin");
            //!check if user2 is in the group1 and the role is member
            expect(relation_userGroup.body.data.role).toBe("member");
        });
    });
    describe("api/v1/groups => getAllGroups user logged in", () => {
        it("should return status=200 and all the groups", async () => {
            //!log for the user2
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            const cookies2 = user2.headers["set-cookie"];
            //!create group2 for user2
            const group2 = await superTest(app)
                .post("/api/v1/groups")
                .send({
                    groupName: "group2",
                })
                .set("Cookie", cookies2);
            //!get all the groups
            const allGroups = await superTest(app)
                .get("/api/v1/groups")
                .set("Cookie", cookies2);
            //!check if the groups are returned
            expect(allGroups.status).toBe(200);
            expect(allGroups.body.success).toBe(true);
            expect(allGroups.body.data.length).toBe(2);
            expect(allGroups.body.data[0].groupName).toBe("group1");
            expect(allGroups.body.data[1].groupName).toBe("group2");
            //!check roles
            const relationsForUser2 = await UserGroup.find({
                userID: user2.body.userId,
            });
            expect(relationsForUser2[0].role).toBe("member");
            expect(relationsForUser2[1].role).toBe("admin");
        });
    });
    describe("api/v1/groups => getSingleGroup user logged in", () => {
        it("should return status=200 and the group", async () => {
            //!log for the user2
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            const cookies2 = user2.headers["set-cookie"];

            //!get the group2
            const allGroups = await superTest(app)
                .get("/api/v1/groups")
                .set("Cookie", cookies2);
            //!get the group1
            const group1 = allGroups.body.data[0];
            //!get the group1
            const singleGroup = await superTest(app)
                .get(`/api/v1/groups/${group1._id}`)
                .set("Cookie", cookies2);
            expect(singleGroup.status).toBe(200);
            expect(singleGroup.body.success).toBe(true);
            expect(singleGroup.body.data.groupName).toBe("group1");
            //!check if the relation user_group is exist
            const relation_userGroup = await UserGroup.findOne({
                userID: user2.body.userId,
                groupID: group1._id,
            });
            expect(relation_userGroup.role).toBeDefined();
        });
    });
    describe("api/v1/groups => updateGroup i'm the admin", () => {
        it("should return status=200 and the updated group", async () => {
            //!log for the user2
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            const cookies2 = user2.headers["set-cookie"];
            //!get my groups
            const allGroups = await superTest(app)
                .get("/api/v1/groups")
                .set("Cookie", cookies2);
            //!get the group2 for user2
            const group2 = allGroups.body.data[1];
            //!update the group2
            const response = await superTest(app)
                .patch(`/api/v1/groups/${group2._id}`)
                .send({ groupName: "group2_updated" })
                .set("Cookie", cookies2);
            //!test the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.groupName).toBe("group2_updated");
        });
    });
    describe("api/v1/groups => getAllMembersOfGroup i'm logged in", () => {
        it("should return status=200 and all the members of the group", async () => {
            //!log for the user2
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            const cookies2 = user2.headers["set-cookie"];
            //!get my groups
            const allGroups = await superTest(app)
                .get("/api/v1/groups")
                .set("Cookie", cookies2);

            const membersForGroup1 = await superTest(app)
                .get(`/api/v1/groups/${allGroups.body.data[0]._id}/members`)
                .set("Cookie", cookies2);
            //!test the response for the members of the group1
            expect(membersForGroup1.status).toBe(200);
            expect(membersForGroup1.body.success).toBe(true);
            expect(membersForGroup1.body.data.length).toBe(2);
            const membersForGroup2 = await superTest(app)
                .get(`/api/v1/groups/${allGroups.body.data[1]._id}/members`)
                .set("Cookie", cookies2);
            //!test the response for the members of the group2
            expect(membersForGroup2.status).toBe(200);
            expect(membersForGroup2.body.success).toBe(true);
            expect(membersForGroup2.body.data.length).toBe(1);
        });
    });
    describe("api/v1/groups => deleteUserFromGroup i'm the admin here and user exist && not admin", () => {
        it("should return status=200 and the deleted relation user_group", async () => {
            //!log for the user1
            const user1 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user1@gmail.com",
                password: "password",
            });
            const cookies1 = user1.headers["set-cookie"];
            //!log for the user2
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            const cookies2 = user2.headers["set-cookie"];
            //!get user1 groups
            const allGroups_user1 = await superTest(app)
                .get("/api/v1/groups")
                .set("Cookie", cookies1);
            //!delete user2 from group1
            const response = await superTest(app)
                .delete(
                    `/api/v1/groups/${allGroups_user1.body.data[1]._id}/members/${user2.body.userId}`
                )
                .set("Cookie", cookies1);
            //!test the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            //!check if the relation user2_group1 is deleted
            const relation_user2Group1 = await UserGroup.findOne({
                userID: user2.body.userId,
                groupID: allGroups_user1.body.data[1]._id,
            });
            expect(relation_user2Group1).toBeNull();
            //!check if the user2 is not in the group1
            const membersForGroup1 = await superTest(app)
                .get(
                    `/api/v1/groups/${allGroups_user1.body.data[1]._id}/members`
                )
                .set("Cookie", cookies1);
            expect(membersForGroup1.body.data.length).toBe(1);
            expect(membersForGroup1.body.data[0].userName).toBe("user1");
        });
    });
    describe("api/v1/groups => deleteGroup i'm the admin here", () => {
        it("should return status=200 and the deleted group", async () => {
            //!log for the user1
            const omar = await superTest(app)
                .post("/api/v1/auth/register")
                .send({
                    email: "omar@gmail.com",
                    password: "password",
                    userName: "omar",
                });
            const cookies = omar.headers["set-cookie"];
            //!create group for omar
            const omar_group = await superTest(app)
                .post("/api/v1/groups")
                .send({
                    groupName: "lgroup ta3i",
                })
                .set("Cookie", cookies);
            //!add user1 && user2 to the group
            const user1 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user1@gmail.com",
                password: "password",
            });
            const user2 = await superTest(app).post("/api/v1/auth/login").send({
                email: "user2@gmail.com",
                password: "password",
            });
            //!add user1 and user2 to the group
            await superTest(app)
                .post(
                    `/api/v1/groups/${omar_group.body.data._id}/members/${user1.body.userId}`
                )
                .set("Cookie", cookies);
            await superTest(app)
                .post(
                    `/api/v1/groups/${omar_group.body.data._id}/members/${user2.body.userId}`
                )
                .set("Cookie", cookies);
            //!check the length of the relations user_group
            const relations = await UserGroup.find({
                groupID: omar_group.body.data._id,
            });
            expect(relations.length).toBe(3);
            //!delete the group
            const response = await superTest(app)
                .delete(`/api/v1/groups/${omar_group.body.data._id}`)
                .set("Cookie", cookies);
            //!test the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            //!check if the group is deleted
            const deletedGroup = await UserGroup.findOne({
                groupID: omar_group.body.data._id,
            });
            expect(deletedGroup).toBeNull();
        });
    });
});
