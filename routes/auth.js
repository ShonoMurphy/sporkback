const router = require ('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const verify = require('./verifyToken');


router.get('/', verify, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.status(400).send(err);
    }
});

router.get('/refresh', verify, async (req, res) => {
    const token = jwt.sign({_id: req.user._id}, process.env.TOKEN_SECRET, { expiresIn: '48h' });
    res.header('auth-token', token).send(token);
});

router.post('/register', async (req, res) => { 
    // Validate data before registering
    const {error} = registerValidation(req.body);
    if (error) {
        console.log(error);
        return res.status(400).send(error.details[0].message);
    }
    // Check if email is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save()
        res.json({user: user._id});
    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // Validate data before logging in
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if email exists in the database
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('User with this email address does not exist');
    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Wrong password');
    // Response on success
    try {
        // Create and assign a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '48h' });
        res.header('auth-token', token).send(token);
    } catch(err) {
        res.status(400).send(err);
}
});

module.exports = router;