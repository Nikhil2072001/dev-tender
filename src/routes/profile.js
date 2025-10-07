const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const validateEditProfileData = require('../utils/validation')

profileRouter.get('/profile/view',userAuth, async (req,res)=>{
    
    try{
       const user = req.user;
        res.send({message:"Successfully fetched user: ",user});

    }catch(err){
        res.status(500).send({message: "Error while loading profile details", err});
    }
    
})

profileRouter.patch('/profile/edit',userAuth, async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;

    try{
        if(!validateEditProfileData(req))
            throw new Error("Invalid Edit Request");
        const loggedUser = req.user;
        const user = Object.keys(req.body).forEach((field) => loggedUser[field] = req.body[field])
            res.status(200).send({message: "User updated Successfully", user});
    }
    catch(err){
        res.status(500).send({message: "Error fetching user", err});
    }
})
module.exports = profileRouter;
