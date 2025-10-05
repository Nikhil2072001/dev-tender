const mongoose = require('mongoose');
const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://nick:cBVfZIvjjlUbaMlK@nodejs.vpnkjal.mongodb.net/devTinder");
};

module.exports = {connectDB};
