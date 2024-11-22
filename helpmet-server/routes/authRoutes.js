const { Router } = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../utils/verifyUser').verifyToken;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authRouter = Router();

authRouter.get('/signup', authController.signup_get);
authRouter.post('/signup', authController.signup_post);
authRouter.get('/login', authController.login_get);
authRouter.post('/login', authController.login_post);
authRouter.get('/logout', authController.logout);
authRouter.get('/companies', verifyToken, authController.getCompanies);
authRouter.put('/updateProfile', verifyToken, authController.updateProfile);
authRouter.post('/uploadProfilePicture', verifyToken, upload.single('profilePicture'), authController.uploadProfilePicture);
authRouter.post('/forgot-password', authController.forgotPassword);

module.exports = authRouter;