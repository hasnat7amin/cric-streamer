// comment post schema 

const mongoose = require("mongoose");

const commentPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    videoUrl:{
        type: String,
        required: false,
    },
    
    avatar: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CommentPost", commentPostSchema);
