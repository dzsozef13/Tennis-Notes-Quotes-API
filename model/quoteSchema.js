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
        content: { type: String },
        author: { type: String }
    }
)

module.exports = mongoose.model("quote", quoteSchema);