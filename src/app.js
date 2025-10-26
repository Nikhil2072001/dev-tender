const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user');
const app = express();
const cookieParser = require('cookie-parser');
const {userAuth} = require('./middleware/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');


connectDB().then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});
}).catch((err)=>{
    console.log("Database connection failed",err);
});

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


app.get('/feed',userAuth, async (req,res)=>{
    try{
        const user = await User.find({});
        if(user.length === 0)
            res.status(404).send({message: "User not found"});
        else
            res.status(200).send({message: "User found", user});
    }
    catch(err){
        res.status(500).send({message: "Error fetching user", err});
    }
})

app.delete('/user',userAuth, async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id: userId});
        if(user.length === 0)
            res.status(404).send({message: "User not found"});
        else
            res.status(200).send({message: "User deleted", user});
    }
    catch(err){
        res.status(500).send({message: "Error fetching user", err});
    }
})



