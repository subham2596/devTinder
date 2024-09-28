const express = require("express");

const app = express();

app.use("/hello", (req, res)=>{
    res.send("Namaste NodeJS!")
})

app.use("/test", (req, res)=>{
    res.send("Hello from test!")
})

app.listen(7777, ()=>{
    console.log("Server is successfully running at port 7777...")
})