// create a schema for circket team having 12 player in a team

const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter team name"],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: [true, "Enter team image"],
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    teamOwner: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      // required: [true, "Enter team owner"]
    },
    teamCaptain: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Player',
      // required: [true, "Enter team captain"]
    },
    slogan: {
      type: String,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    teamScoreList: [
      {
        matchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Match",
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        overs: {
          type: Number,
          default: 0,
        },
        wickets: {
          type: Number,
          default: 0,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", TeamSchema);
