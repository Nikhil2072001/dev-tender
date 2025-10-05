const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user');
const Admin = require('./models/admin');
const bcrypt = require('bcrypt');
const app = express();

connectDB().then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});
}).catch((err)=>{
    console.log("Database connection failed",err);
});

app.use(express.json());

app.post('/register', async(req,res)=>{

    try{
        const {name,age,email,password} = req.body;
        const encryptedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            age,
            email,
            password: encryptedPassword
        });
        await user.save();
        res.status(201).send({message: "User registered successfully", user});
    }catch(err){
        res.status(500).send({message: "Error registering user", err});
    }

});

app.post('/login', async (req, res, err)=>{
    const {email, password} = req.body;
    try{
        const user = await User.find({email: email});
        console.log(user);
        if(!user)
            throw new Error("User not found");
        if(!user[0].password)
            throw new Error("Failed to load data");
        const isMatch = await bcrypt.compare(password, user[0].password);
        if(!isMatch)
            throw new Error("Invalid credentials");
        res.status(200).send({message: "Login successful", user});

    }catch(err){
        res.status(500).send({message: "Error logging in", err});
    }
})

app.get('/user', async (req,res)=>{
    const userName = req.body.name;
    try{
        const user = await User.find({name: userName});
        if(user.length === 0)
            res.status(404).send({message: "User not found"});
        else
            res.status(200).send({message: "User found", user});
    }
    catch(err){
        res.status(500).send({message: "Error fetching user", err});
    }
})

app.get('/feed', async (req,res)=>{
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

app.delete('/user', async (req,res)=>{
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

app.patch('/user', async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id: userId}, data);
        if(user.length === 0)
            res.status(404).send({message: "User not found"});
        else
            res.status(200).send({message: "User updated", user});
    }
    catch(err){
        res.status(500).send({message: "Error fetching user", err});
    }
})

app.post('/admin',async(req,res,err)=>{
    try{
        const data = req.body;
        const user = new Admin(data);
        await user.save();
        res.status(201).send({message: "Admin created successfully", user});
    }catch(err){
        res.status(500).send({message: "Error creating admin", err});
    }
})