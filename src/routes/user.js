const express = require('express');
const userRouter = express.Router();
const {userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequestSchema');

const USER_DATA = "name age gender photoUrl";
userRouter.get('/user/requests/recieved', userAuth,async (req,res)=>{
try{
    const user = req.user;
    const data = await ConnectionRequest.find({
        recieverId: user._id,
        status: "interested",
    }).populate(
        "senderId",
        USER_DATA
    );

    if(data.length === 0){
        return res.status(404).send({message: "No requests found"});
    }
    res.status(200).send({message: "Requests found", data});
}
catch(err){
    res.status(400).send({message:"error while loading requests", err});
}
})

userRouter.get('/user/connections', userAuth, async (req, res)=>{
    try{
        const user = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {senderId: user.id, status: "accepted"},
                {recieverId: user.id, status: "accepted"}
            ]
        }).populate("senderId", USER_DATA );
        if(connections.length=== 0)
            res.send("No connections found");
        const connectionFilteredData = connections.map((val)=> val.senderId);
        res.status(200).send({message: "Connections found", data: connectionFilteredData});
    }catch(err){

    }
})

userRouter.get('/feed', userAuth, async (req, res)=>{
    try{
        const user = req.uesr;
        const allUsers = await User.find({_id: {$ne: user._id}});
        const feedData = await ConnectionRequest.find({
            $and:[
                { $or: [
                    { senderId: {$ne: user._id} },
                    { recieverId: {$ne: user._id} }
                ] },
                { status: "pending" }
            ]
        })
    }
    catch(err){
        res.status(400).send({message: "Error while loading feed", err});
    }
})
module.exports = userRouter;