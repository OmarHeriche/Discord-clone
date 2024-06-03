const {Redis} = require("@upstash/redis");
require("dotenv").config();

const redis = new Redis({
    url: "https://becoming-gator-53672.upstash.io",
    token: process.env.REDIS_TOKEN,
});

console.log("connected to the cache successfully👀");
module.exports = redis;
