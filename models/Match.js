// create a match of 2 circket Team
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, "Enter team1"]
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, "Enter team2"]
    },
    scoreCard:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScoreCard',
        required: [true, "Enter score card"]
    },
    location:{
        type: String,
        required: [true, "Enter location"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter userId"]
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, "Enter winner"]
    },
    matchDate: {
        type: Date,
        default: Date.now
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

module.exports = mongoose.model('Match', MatchSchema);