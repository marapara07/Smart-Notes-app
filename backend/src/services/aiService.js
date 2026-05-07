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

const getTextModel = () => {
  return process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
};

const cleanJsonArray = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return cleaned
      .replace("[", "")
      .replace("]", "")
      .replaceAll('"', "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
};

export const generateSummary = async (content) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env file");
  }

  const response = await getClient().models.generateContent({
    model: getTextModel(),
    contents: `
Generate a short, clear summary for this note.
Use maximum 3 sentences.

Note:
${content}
`,
  });

  return response.text.trim();
};

export const generateTags = async (content) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env file");
  }

  const response = await getClient().models.generateContent({
    model: getTextModel(),
    contents: `
Generate 3 to 6 short tags for this note.
Return only a JSON array of strings.
Do not include markdown.

Example:
["authentication", "backend", "security"]

Note:
${content}
`,
  });

  return cleanJsonArray(response.text);
};

export const answerFromNotes = async (question, notes) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env file");
  }

  const context = notes
    .map((item, index) => {
      const note = item.note || item;

      return `
Note ${index + 1}
Title: ${note.title}
Content: ${note.content}
Summary: ${note.summary || "No summary"}
Tags: ${note.tags?.join(", ") || "No tags"}
`;
    })
    .join("\n");

  const response = await getClient().models.generateContent({
    model: getTextModel(),
    contents: `
You are an assistant that answers questions using only the user's notes.
If the answer is not found in the notes, say that the notes do not contain enough information.

User question:
${question}

User notes:
${context}
`,
  });

  return response.text.trim();
};
