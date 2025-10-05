const mongoose = require('mongoose');
const validator = require('validator');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true, minLength: 2, maxLength: 50},
    age: {type: Number, required: true, min: 18, validate(value){
        if(value < 18){
            throw new Error("Age must be at least 18");
        }
    }},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true, validate(value){
        const isEmail = validator.isEmail(value);
        if(!isEmail)
            throw new Error("Invalid email format");
    }},
    password: {type: String, required: true, validate(value){
        const isValid = validator.isStrongPassword(value);
        if(!isValid)
            throw new Error("Password is not strong enough");
        }
    }
},{timestamps:true});

    const User = mongoose.model('User',userSchema);

    module.exports = User;