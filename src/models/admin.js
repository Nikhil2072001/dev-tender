const Mongoose = require('mongoose');
const validator = require('validator');
 const adminSchema = new Mongoose.Schema({
    name:{
        type: String,
        required:true,
        minLength:2,
        maxLength:50
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            const isEmail = validator.isEmail(value);
            if(!isEmail){
                throw new Error(":Invalid email format");
            }
        }
    },
    age:{
        type: Number,
        min:18,
        required:true
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'], // ✅ correct usage
        required: true
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
    password:{
        type:String,
        required:true,
        validate(value){
            const isValid = validator.isStrongPassword(value);
            if(!isValid){
                throw new Error("Password is not strong enough");
            }
        }
    }
 }, {timestamps:true});
 module.exports = Mongoose.model('Admin',adminSchema);
