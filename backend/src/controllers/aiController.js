import Note from "../models/Note.js";
import { generateSummary, generateTags, answerFromNotes } from "../services/aiService.js";
import { generateEmbedding } from "../services/embeddingService.js";
import cosineSimilarity from "../utils/cosineSimilarity.js";

export const summarizeNote = async (req, res) => {
  try {
    const { noteId, content } = req.body;

    let noteContent = content;
    let note = null;

    if (noteId) {
      note = await Note.findOne({
        _id: noteId,
        userId: req.user._id,
      });

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      noteContent = note.content;
    }

    if (!noteContent) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const summary = await generateSummary(noteContent);

    if (note) {
      note.summary = summary;
      await note.save();
    }

    res.json({ summary });
  } catch (error) {
    res.status(500).json({
      message: "AI summary failed",
    });
  }
};

export const generateNoteTags = async (req, res) => {
  try {
    const { noteId, content } = req.body;

    let noteContent = content;
    let note = null;

    if (noteId) {
      note = await Note.findOne({
        _id: noteId,
        userId: req.user._id,
      });

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      noteContent = note.content;
    }

    if (!noteContent) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const tags = await generateTags(noteContent);

    if (note) {
      note.tags = tags;
      await note.save();
    }

    res.json({ tags });
  } catch (error) {
    res.status(500).json({
      message: "AI tag generation failed",
    });
  }
};

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const queryEmbedding = await generateEmbedding(query);

    const notes = await Note.find({
      userId: req.user._id,
      embedding: { $exists: true, $ne: [] },
    });

    if (notes.length === 0) {
      return res.status(404).json({
        message: "No notes found. Please create notes first.",
      });
    }

    const results = notes
      .map((note) => ({
        note,
        score: cosineSimilarity(queryEmbedding, note.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Semantic search failed",
    });
  }
};

export const askNotes = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const questionEmbedding = await generateEmbedding(question);

    const notes = await Note.find({
      userId: req.user._id,
      embedding: { $exists: true, $ne: [] },
    });

    if (notes.length === 0) {
      return res.status(404).json({
        message: "No notes found. Please create notes before using Ask Your Notes.",
      });
    }

    const relevantNotes = notes
      .map((note) => ({
        note,
        score: cosineSimilarity(questionEmbedding, note.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const answer = await answerFromNotes(question, relevantNotes);

    res.json({
      answer,
      sources: relevantNotes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ask Your Notes failed",
    });
  }
};