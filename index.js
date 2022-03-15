const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require('./routes/userRoutes')
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
);

mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});


app.use("/api/user",userRouter)

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));
