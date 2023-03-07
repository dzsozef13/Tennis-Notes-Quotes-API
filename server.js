const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

/**
 * Body Parser
 */
app.use(bodyParser.json());

/**
 * Environment
 * 
 * - PORT
 * - DBHOST
 */
require("dotenv-flow").config();
const port = process.env.PORT || 4000;
const dbHost = process.env.DBHOST;

/**
 * Server Status
 */
app.listen(port, function() {
    console.log("Server is running at: " + port);
})

/**
 * Endpoints
 * 
 * - /routes/auth/auth
 * - /routes/quote/quote
 */
const authRoutes = require("./routes/auth/auth");
const quoteRoutes = require("./routes/quote/quote");

app.use("/auth", authRoutes);
app.use("/quote", quoteRoutes);

/**
 * Swagger Config
 * 
 * Endpoint
 * - /api-docs
 */
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

/**
 * MongoDB Connection
 */
mongoose.set('strictQuery', true);
mongoose.connect(
    dbHost,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Failed to connect to MongoDB with error: " + error));
mongoose.connection.once("open", () => console.log("Connected to MongoDB."));

module.exports = app;