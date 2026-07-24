

const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
})

const embeddingService = {};

embeddingService.generateEmbedding = async(text) =>{
    const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text
});

console.log(response.embeddings[0].values.length);
return response.embeddings[0].values;
}

module.exports = embeddingService;