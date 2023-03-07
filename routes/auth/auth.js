/**
 * Authorisation routes
 * 
 * - User Registration
 * - User Validation
 */

const router = require('express').Router();
const user = require('../../model/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { registerValidation, loginValidation } = require('./util/auth+validation');

/* 
    /register
*/
router.post('/register', async (req, res) => {
    // Validate user input
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if user already exists
    const emailExists = await user.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    // Create a new user
    const newUser = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

/* 
    /login 
*/
router.post('/login', async (req, res) => {
    // Validate user input
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if email exists in the database
    const currentUser = await user.findOne({ email: req.body.email });
    if (!currentUser) return res.status(400).send('Email or password is wrong');
  
    // Check if password is correct
    const validPassword = await bcrypt.compare(
        req.body.password,
        currentUser.password
    );
    if (!validPassword) return res.status(400).send('Email or password is wrong');
  
    // Add name and token to response
    const token = jwt.sign({ _id: currentUser._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({
        "name": currentUser.name,
        "token": token
    });
});

module.exports = router;