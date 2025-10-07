const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signUp', async(req,res)=>{

    try{
        const {name,age,email,gender,photoUrl,password} = req.body;
        const encryptedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            age,
            email,
            gender,
            photoUrl,
            password: encryptedPassword
        });
        await user.save();
        res.status(201).send({message: "User registered successfully", user});
    }catch(err){
        res.status(500).send({message: "Error registering user", err});
    }

});

authRouter.post('/login', async (req, res, err)=>{
    const {email, password} = req.body;
    try{
        
        const user = await User.findOne({email: email});
        const userId = user._id;
        const token = await user.getJWT();

        if(!user)
            throw new Error("User not found");
        if(!user.password)
            throw new Error("Failed to load data");
        const isMatch = await user.validatePassword(password);
        if(!isMatch)
            throw new Error("Invalid credentials");
        res.cookie("token",token,{ expires: new Date(Date.now() +   1*3600000) }); // expire in 1 hr
        res.status(200).send({message: "Login successful", user});

    }catch(err){
        res.status(500).send({message: "Error logging in", err});
    }
})

authRouter.post('/logout', async(req,res)=>{

    try{
        res.cookie("token", null, { expires: new Date(Date.now())});
        res.status(201).send({message: "User logout successfully"});
    }catch(err){
        res.status(500).send({message: "Error logging out", err});
    }

});


module.exports = authRouter;