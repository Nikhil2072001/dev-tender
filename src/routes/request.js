const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequestSchema');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req, res)=>{

    try{
        const fromUserId = req.user._id.toString();
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        console.log(fromUserId, status, toUserId);
        const allowedStatuses = ['ignored','interested'];
        if(!allowedStatuses.includes(status)){
            throw new Error("Invalid status");
        }
        const toUser = await User.findById({_id:toUserId});
        if(!toUser){
            throw new Error("User not found");
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderId: fromUserId, recieverId: toUserId },
                { senderId: toUserId, recieverId: fromUserId }
            ]
            });
        if(existingRequest){
            throw new Error("Request already sent");
        }
        
        const connectionRequest = new ConnectionRequest({
        senderId: fromUserId,
        recieverId: toUserId,
        status
        });
        await connectionRequest.save();
        
        res.status(200).send({message:user.name + " is now " + status + " in connecting with user"});
    }catch(err){
        console.error("Request error:", err); // This will show full stack trace in console
        res.status(400).send({
            message: "Cannot send request",
            error: err.message || "Unknown error"
        });
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res)=>{
    try{
        const user = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;
        const allowedStatuses = ['accepted', 'rejected'];
        if(!allowedStatuses.includes(status)){
            throw new Error("Invalid status");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            senderId: requestId,
            recieverId: user._id,
            status: "interested",
        });
        if(!connectionRequest){
            return res.status(404).send({message: "No pending request found"});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).send({message: "Request " + status, data});

    }
    catch(err){
        res.status(400).send({
            message: "Cannot review request",
            error: err.message || "Unknown error"
        });
    }
});
module.exports = requestRouter;