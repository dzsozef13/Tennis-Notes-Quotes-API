const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { append } = require("express/lib/response");

// App
const app = express();

require("dotenv-flow").config();

// Port
const port = process.env.PORT || 4000;
const dbHost = process.env.DBHOST;

// Routes

const authRoutes = require("./routes/auth/auth");
// const blogpostRoutes = require("./routes/blogpost/blogpost");
// const quoteRoutes = require("./routes/quote/quote");

app.use("/auth", authRoutes);
// app.use("/blogpost", blogpostRoutes);
// app.use("/quote", quoteRoutes);

app.listen(port, function() {
    console.log("Server is running at: " + port);
})

app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome to Tennis Notes API"});
});

mongoose.set('strictQuery', true);

// Mongoose Connect
mongoose.connect(
    dbHost,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Failed to connect to MongoDB with error: " + error));

mongoose.connection.once("open", () => console.log("Connected to MongoDB."));

module.exports = app;