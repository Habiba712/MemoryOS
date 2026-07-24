

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/files/file.controller');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });
router.post('/createFile', upload.single('file'),fileController.createFile);

module.exports = router;