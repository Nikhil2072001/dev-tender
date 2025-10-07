const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true, minLength: 2, maxLength: 50},
    age: {type: Number, required: true, min: 18, validate(value){
        if(value < 18){
            throw new Error("Age must be at least 18");
        }
    }},
    email: {type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            const isEmail = validator.isEmail(value);
            if(!isEmail){
                throw new Error(":Invalid email format");
            }
        }},
    gender:{
        type: String,
        enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not supported'
        },
        required: true
        // validate(value) {
        //     console.log("Validating gender:", value);  // Log the gender value
        //     if (!value) {
        //         throw new Error('Gender is required');
        //     }
        // }
    },
    photoUrl:{
        type:String,
        maxLength:255,
        validate(value){
            const url = validator.isURL(value);
            if(!url){
                throw new Error("Invalid URL format");
            }
        }
    },
    password: {
        type:String,
        required:true,
        validate(value){
            const isValid = validator.isStrongPassword(value);
            if(!isValid){
                throw new Error("Password is not strong enough");
            }
        }
    }
},{timestamps:true});

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isMatch = await bcrypt.compare(passwordInputByUser, user.password);
    return isMatch;
}

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign(
                { userId: user._id.toString() }, // Payload
                "devSecret@123",                // Secret key
                { expiresIn: '1h' }            // Options
                );
    return token;
}

const User = mongoose.model('User',userSchema);

module.exports = User;