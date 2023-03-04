/**
 * Blogpost Schema
 * 
 * - Content
 * - Author
 * - Date
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let blogpostSchema = new Schema(
    {
        content: { type: String },
        author: { type: String },
        date: { type: Date, default: Date.now },
    }
)

module.exports = mongoose.model("blogpost", blogpostSchema);