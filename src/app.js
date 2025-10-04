const express = require('express');
const app = express();
app.use("/home",(req,res)=>{
    res.send("Hello World");
});
app.use("/user",(req,res)=>{
    res.send("User Page");
});
app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});

