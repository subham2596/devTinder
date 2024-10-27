const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://subham96bhagat:2Tf2R4cxyH0ewUnO@cluster0.b8lbu.mongodb.net/helloTinder")
}

module.exports = connectDB