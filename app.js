//!import :start
const express = require('express');
const notFound = require('./middleware/notFound');
const userRouter = require('./routes/user');
const friendRouter = require('./routes/friend');
const register_login_router = require('./routes/auth');
const groupRouter = require('./routes/group');
require('dotenv').config();
require("express-async-errors");
//!import :end

const app = express();
app.use(express.json());

//!my routes :start
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', register_login_router);
app.use('/api/v1/friends', friendRouter);
app.use('/api/v1/groups', groupRouter);
app.get('/', (req, res) => {
  res.send(`<h1 style="text-align:center">Here i will put the swager documentation:</h1>`);
});
//!my routes :end
//!error handling :start
app.use(notFound);
//!error handling :end

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
