

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/files/file.controller');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });


router.post('/createFile', upload.single('file'),fileController.createFile);
router.post('/saveUrl', upload.single('file'),fileController.saveUrl);
router.get('/search', fileController.getFiles);
router.get('/filesByUser/:userId', fileController.getFilesByUser);
router.get('/getFile/:id', fileController.getFile);

module.exports = router;