const mongoose = require('mongoose');

const connectDB = (connectionURL)=>{
    console.log("connected to the db successfully 🫡");
    return mongoose.connect(connectionURL);

}
module.exports = connectDB;