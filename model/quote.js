const mongoose = require("mongoose");

// Mongoose Schema
const Schema = mongoose.Schema;

// Quote Schema
let quoteSchema = new Schema(
    {
        content: {type: String},
        author: { type: String}
    }
)

module.exports = mongoose.model("quote", quoteSchema);