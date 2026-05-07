import { GoogleGenAI } from "@google/genai";

let ai = null;

const getClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return ai;
};

export const generateEmbedding = async (text) => {
  if (!text || text.trim() === "") {
    return [];
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env file");
  }

  const response = await getClient().models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
    contents: text,
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Gemini embedding response did not contain values");
  }

  return embedding;
};
