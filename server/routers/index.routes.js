const express = require('express');
const router = express.Router();

const health = require('../controllers/health.controller');
const authRoutes = require('./user/auth.routes');
const userRoutes = require('./user/user.routes');
const fileRoutes = require('./file.routes');
// const authMiddleware = require('../middlewares/auth.middleware');


//public routes
router.get('/health', health.ping);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/file', fileRoutes);

//protected routes

// router.use('/pointDeVente', pointsDeVentesRoutes);


module.exports = router;