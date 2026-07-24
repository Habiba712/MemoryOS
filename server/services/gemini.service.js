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
                text: `
Analyze this image.

Return ONLY valid JSON.

{
  "title": "",
  "description": "",
  "tags": [],
  "category": ""
}

Rules:
- title: maximum 6 words.
- description: 1-2 sentences.
- tags: 5-10 relevant keywords.
- category: choose ONE from:
Programming, Design, Travel, Food, Fitness, Work, Finance, Education, Research, Shopping, Other.

Do not include markdown.
Do not wrap the JSON in \`\`\`.
Return ONLY valid JSON.
`
            }
        ]
    });

    const text = response.text;

    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
};

module.exports = geminiService;