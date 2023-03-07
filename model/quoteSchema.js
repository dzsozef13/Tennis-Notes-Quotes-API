/**
 * Quote Schema
 * 
 * - Content
 * - Author
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let quoteSchema = new Schema(
    {
        content: { type: String, require: true },
        author: { type: String, require: true },
        appears: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    }
)

module.exports = mongoose.model("quote", quoteSchema);