const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const socialMediaController = require("../controllers/imports/imports.controller");
const upload = multer({
    dest: "uploads/instagram/",
});

router.post("/import", upload.single("instagramZip"), 
socialMediaController.unzip);



module.exports = router;