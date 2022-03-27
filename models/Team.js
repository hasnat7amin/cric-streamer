// create a schema for circket team having 12 player in a team

const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter team name"],
    },
    teamOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter team owner"]
    },
    teamCaptain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: [true, "Enter team captain"]
    },
    city: {
        type: String,
        required: [true, "Enter team country"],
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    rating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', TeamSchema);