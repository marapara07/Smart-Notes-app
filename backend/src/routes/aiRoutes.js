import express from "express";
import {
  summarizeNote,
  generateNoteTags,
  semanticSearch,
  askNotes,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/summarize", summarizeNote);
router.post("/generate-tags", generateNoteTags);
router.post("/semantic-search", semanticSearch);
router.post("/ask-notes", askNotes);

export default router;