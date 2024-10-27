const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res)=>{

    // console.log(req.body);

    // const userObj = {
    //     firstname: "Akshay",
    //     lastname: "Saini",
    //     email: "akshay@saini.com",
    //     password: "akshay@123"
    // }
    try {
        const user = new User(req.body);
        const save = await user.save();
        // console.log(save)
        res.send("User addded to the database")
    } catch (error) {
        res.status(400).send("Failed to add user to database - " + error.message);
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

