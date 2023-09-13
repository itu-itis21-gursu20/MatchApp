const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const imageRoute = require("./routes/images.js");
const conversationRoute = require("./routes/conversations.js");
const messageRoute = require("./routes/messages.js");

const app = express();

const cors = require("cors");

dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URI).then(
        console.log("connected to db")
    ).catch( (err) => {
        console.log(err);
    })
}

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/images", imageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);



app.listen(process.env.PORT, () => {
    connect();
    console.log("connected to server");
});




