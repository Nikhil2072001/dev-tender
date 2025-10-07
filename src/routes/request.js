const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth');

requestRouter.post('/request/send/interested', userAuth, async(req, res)=>{
    const user = req.user;
    try{
        res.status(200).send({message:user.name +" sent request successfully"});
    }catch(err){
        res.status(401).send({message:"Cannot sent request", err});
    }
})
module.exports = requestRouter;