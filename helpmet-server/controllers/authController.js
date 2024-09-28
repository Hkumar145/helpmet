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
    const { email, password } = req.body;
    
    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // Create a JWT token
        const accessToken = jwt.sign(
            { "UserInfo": { "email": foundUser.email } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Create a refresh token
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save the refresh token to the user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Send refresh token as a cookie and accessToken in response
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Login Failed' });
    }
};
