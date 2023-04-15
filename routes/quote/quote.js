/**
 * Quote Routes
 * 
 * - Get Single Quote
 * - Get All Quotes
 * - Create Quote
 * - Delete Quote
 */

const router = require("express").Router();
const quote = require('../../model/quoteSchema');

const { verifyToken } = require('../util/route+verifyToken');
const { mapQuote, mapQuotes } = require('./util/quote+mapper');

/**
 * Create Quote
 * 
 * POST - /
 */
router.post("/", verifyToken, (req, res) => {
    data = req.body;

    quote.insertMany( data )
    .then(data => { 
        res.send(data) 
    })
    .catch (err => { 
        res.status(500).send({ message: err.message })
    })
});

/**
 * All Quotes
 * 
 * GET - /
 */
router.get("/", (req, res) => {   
    quote.find()
    .then(data => { 
        res.send(mapQuotes(data))
    })
    .catch (err => { 
        res.status(500).send({ message: err.message })
    })
});

/**
 * Current Quote
 * 
 * GET - /current
 */
router.get("/current", (req, res) => {
    quote.findOneAndUpdate({}, { $inc: { appears: 1 } }, { sort: { createdAt: -1 }, new: true })
    .then(data => {
        if (!data) {
            return res.status(404).send({ message: "It's quiet here..." });
        }
        res.send(mapQuote(data));
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

/**
 * Quote by Author
 * 
 * GET - /author/:author
 */
router.get("/author/:author", (req, res) => {
    const author = req.params.author;
    const pattern = new RegExp(author, 'i');

    quote.find({ author: { $regex: pattern } })
    .then(data => { 
        if (!data) {
            return res.status(404).send({ message: "It's quiet here..." });
        }
        res.send(mapQuotes(data));
    })  
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
});

/**
 * Update Quote
 * 
 * PUT - /:id
 */
router.put("/:id", verifyToken, (req, res) => {   
    const id = req.params.id;

    quote.findByIdAndUpdate(id, req.body)
    .then(data => {
        if (!data) {
            res.status(404).send({ message: "Could not find quote with id: " + id });
        }
        else {
            res.send({ message: "Updated quote with id: " + id });
        }
    })
    .catch (err => { 
        res.status(500).send({ message: err.message })
    })
});

/**
 * Delete Quote
 * 
 * DELETE - /:id
 */
router.delete("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    quote.findByIdAndDelete(id)
    .then(data => { 
        if (!data) {
            res.status(404).send({ message: "Could not find quote with id: " + id });
        }
        else {
            res.send({ message: "Quote deleted forever..." });
        }
    })
    .catch (err => { 
        res.status(500).send({ message: "Error deleting quote with id " + id })
    })
});

module.exports = router;