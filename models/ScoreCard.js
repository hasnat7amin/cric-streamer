// create a score card schema with history of every team

const mongoose = require('mongoose');

const ScoreCardSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: [true, "Enter matchId"]
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter userId"]
    },
    matchVideo: {
        type: String,
        required: [true, "Enter match video link"],
    },
    team1Score:[
        {
            totalScore: {
                type: Number,
                default: 0,
            },
            overs:{
                type: Number,
                default: 0,
            },
            out:{
                type: Number,
                default: 0,
            },
            six:{
                type: Boolean,
                default: false,
            },
            four:{
                type: Boolean,
                default: false,
            },
            wicket:{
                type: Boolean,
                default: false,
            },
            videoStartTime: {
                type: Number,
                required: [true, "Enter video start time"],
            },
            videoEndTime: {
                type: Number,
                required: [true, "Enter video end time"],
            },
            player1ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter player1ID"],
            },
            player1Score: { 
                type: Number,
                required: [true, "Enter player1Score"],
            },
            player2ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter player2ID"],
            },
            player2Score: { 
                type: Number,
                required: [true, "Enter player2Score"],
            },
            ballerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter bollerId"],
            },
            ballerScore: {
                type: Number,
                required: [true, "Enter bollerScore"],
            },
            highlights:{
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    team2Score:[
        {
            totalScore: {
                type: Number,
                default: 0,
            },
            overs:{
                type: Number,
                default: 0,
            },
            out:{
                type: Number,
                default: 0,
            },
            six:{
                type: Boolean,
                default: false,
            },
            four:{
                type: Boolean,
                default: false,
            },
            wicket:{
                type: Boolean,
                default: false,
            },
            videoStartTime: {
                type: Number,
                required: [true, "Enter video start time"],
            },
            videoEndTime: {
                type: Number,
                required: [true, "Enter video end time"],
            },
            player1ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter player1ID"],
            },
            player1Score: { 
                type: Number,
                required: [true, "Enter player1Score"],
            },
            player2ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter player2ID"],
            },
            player2Score: { 
                type: Number,
                required: [true, "Enter player2Score"],
            },
            ballerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
                required: [true, "Enter bollerId"],
            },
            ballerScore: {
                type: Number,
                required: [true, "Enter bollerScore"],
            },
            highlights:{
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
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

module.exports = mongoose.model('ScoreCard', ScoreCardSchema);
