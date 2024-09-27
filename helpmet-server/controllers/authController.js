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

}
