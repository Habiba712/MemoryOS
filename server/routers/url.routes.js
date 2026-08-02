

const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urls/url.controller');
const multer = require("multer");


router.post('/saveUrl', urlController.saveUrl);
router.get('/getUrlsByUser/:userId', urlController.getUrlsByUser);
router.get('/getUrl/:id', urlController.getUrl);

module.exports = router;