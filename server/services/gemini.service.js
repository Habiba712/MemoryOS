

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const geminiService = {};
geminiService.describeImage = async (imageBuffer, mimeType) => {
 
const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: [
        {
            inlineData: {
                mimeType: mimeType,
                data: imageBuffer.toString("base64")
            }
        },
        {
            text: "Describe this image in one short paragraph."
        }
    ]
});
return response.text;
};


module.exports = geminiService;