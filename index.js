const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const playerRouter = require('./routes/playerRoutes')
const matchRouter = require('./routes/matchRoutes')
const scoreCardRouter = require('./routes/scoreCardRoutes')
const teamRouter = require('./routes/teamRoutes')

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
);

// djaskf
mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});


app.use("/api/user",userRouter)
app.use("/api/posts",postRouter)
app.use("/api/player", playerRouter);
app.use("/api/match", matchRouter);
app.use("/api/scoreCard", scoreCardRouter)
app.use("/api/team", teamRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to Cric Streamer Backend App.")
})
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));
