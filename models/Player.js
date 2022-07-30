// create a schema for the circket player team
const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter player name"],
    },
    cnic: {
      type: String,
      required: [true, "Enter player cnic"],
    },
    role: {
      type: String,
      required: [true, "Enter player role"],
    },
    playerScoreList: [
      {
        matchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Match",
        },
        teamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
        playedTotalScore: {
          type: Number,
          default: 0,
        },
        bolledTotalScore: {
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
    city: {
      type: String,
    },
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

module.exports = mongoose.model("Player", PlayerSchema);
