const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Company } = require('../models/schemas');
const { uploadToS3 } = require('../utils/s3Upload');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { sendForgotPasswordEmail } = require('../utils/emailService');

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
        
        let companyID = 100001;
        const latestCompany = await Company.findOne().sort({ companyID: -1 });
        if (latestCompany) {
            companyID = latestCompany.companyID + 1;
        }

        const company = await Company.create({
            companyID,
            companyName: username,
            companyAddress: "100 West 49th Avenue",
            contactEmail: email,
            city: "Vancouver",
            country: "Canada",
            province: "BC",
            postCode: "V5Y 2Z6"
        });
        res.status(201).json({ user, company });
    } catch (err) {
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

        const company = await Company.findOne({ contactEmail: email });

        const accessToken = jwt.sign(
            { 
                id: validUser._id,
                companyID: company ? company._id : null,
                email: validUser.email
            }, 
            process.env.ACCESS_TOKEN_SECRET
        );

        const { password: pwd, ...rest } = validUser._doc;
        res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'None' })
            .status(200)
            .json({ ...rest, companyID: company ? company._id : null });     // Adding SameSite='None' to enable proper cookie handling across frontend and backend running on different ports
        // const expiryDate = new Date(Date.now() + 3600000);  // 1 hour
        // res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: 'Logged out successfully'});
};

exports.getCompanies = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const { email } = req.user;
    try {
        const company = await Company.findOne({ contactEmail: email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const imageUrl = await uploadToS3([req.file]);
        res.status(200).json({ url: imageUrl[0] });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ error: "Failed to upload profile picture" });
    }
};

exports.updateProfile = async (req, res) => {
    const { username, email, password, companyID, profilePicture } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                password: await bcrypt.hash(password, 10),
                profilePicture
            },
            { new: true }
        );

        const parsedCompanyID = Number(companyID);
        if (!isNaN(parsedCompanyID)) {
            await Company.findOneAndUpdate(
                { companyID: parsedCompanyID },
                { contactEmail: email, companyName: username }
            );
        } else {
            console.error("Invalid companyID:", companyID);
            return res.status(400).json({ error: "Invalid company ID" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "An error occurred while updating the profile." });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'No account found with the provided email.' });
  
      const newPassword = '1234';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ email }, { password: hashedPassword });
  
      await sendForgotPasswordEmail(email, newPassword);
  
      res.status(200).json({ message: 'Password reset email has been sent.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Failed to reset password.' });
    }
};