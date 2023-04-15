/**
 * Authorisation Routes
 * 
 * - User Registration
 * - User Validation
 */

const router = require('express').Router();
const user = require('../../model/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { registerValidation, loginValidation } = require('./util/auth+validation');

/**
 * Register User
 * 
 * POST - /register
 */
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const emailExists = await user.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
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

/**
 * Login User
 * 
 * POST - /login
 */
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const currentUser = await user.findOne({ email: req.body.email });
    if (!currentUser) return res.status(400).send('Email or password is wrong');
  
    const validPassword = await bcrypt.compare(
        req.body.password,
        currentUser.password
    );
    if (!validPassword) return res.status(400).send('Email or password is wrong');
  
    const token = jwt.sign({ _id: currentUser._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({
        "name": currentUser.name,
        "token": token
    });
});

module.exports = router;