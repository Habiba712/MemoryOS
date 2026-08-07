const Router = require('express').Router;
const videoController = require('../controllers/videos/video.controller')
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const router = Router();

router.post('/saveVideo',videoController.saveVideo);
router.get('/getVideoFiles/:userId', videoController.getVideoFiles);

module.exports = router;