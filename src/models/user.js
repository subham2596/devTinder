const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    lastname: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        // validate(value) {
        //     console.log("Entered value - ", value);
        //     console.log("value.indexOf - ", value.indexOf("@"))
        //     if(value.indexOf("@") === -1){
        //         throw new Error("Enter valid mailid.")
        //     }
        // }
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Enter valid email id - " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password - " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        // default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png"
        default: "https://geographyandyou.com/images/user-profile.png",
        maxLength: 255,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url - " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
        trim: true,
        minLength: 10,
        maxLength: 400
    },
    skills: {
        type: [String],
        default: ["JavaScript"]
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;