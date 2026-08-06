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
                    "category": "",
                    "summary": ""
                    }

                    Rules:
                    - title: maximum 6 words.
                    - description: 1-2 sentences.
                    - tags: 5-10 relevant keywords.
                    - summary: 1-2 sentences summarizing the image.
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
geminiService.describeText = async (text) => {

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `
                Analyze the following document.

                Return ONLY valid JSON.

                {
                "title": "",
                "description": "",
                "tags": [],
                "category": "",
                "summary": ""
                }

                Rules:
                - title: maximum 6 words1.
                - description: 1-2 sentences summarizing the document.
                - tags: 5-10 relevant keywords.
                - summary: 1-2 sentences summarizing the document.
                - category: choose ONE from:
                Programming, Design, Travel, Food, Fitness, Work, Finance, Education, Research, Shopping, Other.

                Document:

                ${text.slice(0, 12000)}
                `
    });

    const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
};


geminiService.describeVideo = async (videoBuffer, mimeType = "video/mp4") => {
    const prompt = `
                Watch this video and respond with ONLY valid JSON, no markdown, no code fences, in this exact shape:
                {
                "title": "short descriptive title",
                "description": "1-2 sentence description of what happens in the video",
                "summary": "a slightly longer summary, 2-3 sentences",
                "tags": ["tag1", "tag2", "tag3"],
                "category": "one of: Tutorial, Entertainment, Cooking, Fitness, Tech, Gym, Cooking, Health, Entertainment, Other"
                }
                `;

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [
            {
                role: "user",
                parts: [
                    { inlineData: { mimeType, data: videoBuffer.toString("base64") } },
                    { text: prompt }
                ]
            }
        ]
    });

    const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
};


module.exports = geminiService;