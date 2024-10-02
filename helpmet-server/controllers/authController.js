const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Errors handling
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // duplicated errors
    if (err.code === 11000) {
        errors.email = 'This email is already registered'
        return errors;
    }
    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

exports.signup_get = (req, res) => {
    res.render('signup');
}

exports.login_get = (req, res) => {
    res.render('login');
}

exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
 
exports.login_post = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ message: 'User not found' });
        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) return res.status(401).json({ message: 'Wrong credentials' });

        const accessToken = jwt.sign({ id: validUser._id }, process.env.ACCESS_TOKEN_SECRET);
        const { password: pwd, ...rest } = validUser._doc;
        res.cookie('access_token', accessToken, { httpOnly: true }).status(200).json(rest);
        // const expiryDate = new Date(Date.now() + 3600000);  // 1 hour
        // res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: 'Logged out successfully'});
};