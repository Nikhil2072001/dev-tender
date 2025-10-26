const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        enum: {
            values: ['ignored','interested', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        }
    }
}, {timestamps: true});

connectionRequestSchema.index({senderId:1, recieverId:1});

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;
    if(connectionRequest.senderId.equals(connectionRequest.recieverId)){
        throw new Error("You cannot send request to yourself");
    }
    next();
})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);