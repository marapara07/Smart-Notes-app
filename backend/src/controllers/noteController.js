import Note from "../models/Note.js";
import { generateEmbedding } from "../services/embeddingService.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get notes",
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get note",
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, summary, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const embedding = await generateEmbedding(`${title}\n${content}`);

    const note = await Note.create({
      userId: req.user._id,
      title,
      content,
      embedding,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, summary, tags } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (summary !== undefined) note.summary = summary;
    if (tags !== undefined) note.tags = tags;

    if (title !== undefined || content !== undefined) {
      note.embedding = await generateEmbedding(`${note.title}\n${note.content}`);
    }

    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};