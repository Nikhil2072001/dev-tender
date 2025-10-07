const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth= async(req, res,next)=>{
     const {token} = req.cookies;
    try{
        const decodedToken = await jwt.verify(token,"devSecret@123");
        const user = await User.findOne({_id: decodedToken.userId});
        if(!user)
            throw new Error("Failed to fetch data");

        req.user = user;
        next();

    }catch(err){
        res.status(500).send({message: "Error while loading profile details", err});
    }
}
module.exports = { userAuth};