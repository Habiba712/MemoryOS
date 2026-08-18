const express = require('express');
const router = express.Router();

const health = require('../controllers/health.controller');
const authRoutes = require('./user/auth.routes');
const userRoutes = require('./user/user.routes');
const fileRoutes = require('./file.routes');
const urlRoutes = require('./url.routes');
const videoRoutes = require('./video.routes');
const instagramRoutes = require('./socialMedia.routes');
// const authMiddleware = require('../middlewares/auth.middleware');


//public routes
router.get('/health', health.ping);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/file', fileRoutes);
router.use('/url', urlRoutes);
router.use('/video', videoRoutes);
router.use('/insta', instagramRoutes);


//protected routes

// router.use('/pointDeVente', pointsDeVentesRoutes);


module.exports = router;