const { Router } = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../utils/verifyUser').verifyToken;

const authRouter = Router();

authRouter.get('/signup', authController.signup_get);
authRouter.post('/signup', authController.signup_post);
authRouter.get('/login', authController.login_get);
authRouter.post('/login', authController.login_post);
authRouter.get('/logout', authController.logout);
authRouter.get('/companies', verifyToken, authController.getCompanies);

module.exports = authRouter;