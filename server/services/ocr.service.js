const Tesseract = require("tesseract.js");
const ocrService = {};

ocrService.extractText = async (imagebuffer) => {
    const result = await Tesseract.recognize(imagebuffer, "eng+fra+ara");
    return result.data.text;
}

module.exports = ocrService;