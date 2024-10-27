const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res)=>{

    // console.log(req.body);

    // const userObj = {
    //     firstname: "Akshay",
    //     lastname: "Saini",
    //     email: "akshay@saini.com",
    //     password: "akshay@123"
    // }

    try {
        // first validate the data in req.body
        // if the validation is not successful  it will throw the error and catch block will handle it
        validateSignupData(req);

        // now encrypt the password
        const {firstname, lastname, email, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashPassword
        });
        const save = await user.save();
        // console.log(save)
        res.send("User addded to the database")
    } catch (error) {
        res.status(400).send("Failed to add user to database - " + error.message);
    }
})

app.post("/login", async (req, res)=>{
    try {
        const { email , password } = req.body;

        if(!validator.isEmail(email)) {
            throw new Error("Enter valid email id.")
        }

        // check if thhe email id is registered
        const user = await User.findOne({
            email
        })
        console.log("login user - ", user);
        if(!user) {
            throw new Error("Invalid Credentials.");
        }
        const isUserAuthenticated = await bcrypt.compare(password, user.password);
        console.log("isUserAuthenticated - ", isUserAuthenticated);
        if(!isUserAuthenticated) throw new Error("Invalid Credentials.");

        // if the user is authenticated, generate token for future requests
        const token = await jwt.sign({_id: user._id}, "DEV@TINDER123");
        res.cookie("token", token);

        res.send("Login Successful.")
    } catch (error) {
        res.status(400).send("Failed to log in - " + error.message);
    }
})

app.get("/profile", async(req, res)=>{
    const token = req.cookies.token;
    console.log("get token - ", token);
    try {
        const decoded = jwt.verify(token, "DEV@TINDER123");
        if(!decoded){
            throw new Error("Invalid Token.");
        }
        const {_id} = decoded;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist.");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR - " + error.message);
    }
})

app.get("/user", async (req, res)=> {
    try {
        const users = await User.find({email: req.body.email})
        if(!users.length) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
})

app.get("/feed", async (req, res)=> {
    try {
        const users = await User.find()
        if(!users.length) {
            res.status(404).send("No users");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
})

app.delete("/user", async (req, res)=> {
    try {
        const user = await User.findByIdAndDelete(req.body.userId)
        console.log(req.body.userId)
        console.log("user - ", user);
        if(!user) {
            res.status(404).send("User does not exist")
        } else {
            res.send("User deleted successfully " + user);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!" + error.message);
    }
})

app.patch("/user/:userId", async (req, res)=> {
    const userId = req.params.userId;
    const data = req.body
    const ALLOWEDUPDATE = ["password", "age", "gender", "photoUrl", "about", "skills"]
    const isUpdateAllowed = Object.keys(data).every(k=>ALLOWEDUPDATE.includes(k));
    
    try {
        if(!isUpdateAllowed){
            throw new Error("Update is not allowed in the mentioned fields.")
        }
        if(data?.skills?.length > 10) {
            throw new Error("Skills cannot be more than 10.")
        }
        const user = await User.findByIdAndUpdate(userId, req.body, {
            returnDocument: "before",
            runValidators: true
        })
        console.log("user - ", user);
        if(!user) {
            res.status(404).send("User does not exist")
        } else {
            res.send("User updated successfully " + user);
        }
        
    } catch (error) {
        res.status(400).send("Something went wrong - " + error.message);
    }
})

connectDB().then(()=>{
    console.log("Database connection has been established successfully!");
    app.listen(7777, () => {
        console.log("Server is successfully running at port 7777...")
    })
}).catch((err)=>{
    console.log("Failed to connect to the database - ", err)
})

