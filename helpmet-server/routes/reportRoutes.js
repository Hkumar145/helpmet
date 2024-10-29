const { Router } = require('express');
const { verifyToken } = require('../utils/verifyUser');
const reportController = require('../controllers/reportController');

const reportRouter = Router();

// reportRouter.post('/create', verifyToken, reportController.createReport);

module.exports = reportRouter;