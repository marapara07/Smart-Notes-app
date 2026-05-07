import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!isEditMode) return;

      try {
        const response = await API.get(`/notes/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setSummary(response.data.summary || "");
        setTags(response.data.tags || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load note");
      }
    };

    fetchNote();
  }, [id, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      if (isEditMode) {
        await API.put(`/notes/${id}`, { title, content, summary, tags });
      } else {
        await API.post("/notes", { title, content, summary, tags });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
    }
  };

  const handleGenerateSummary = async () => {
    setError("");
    if (!content.trim()) {
      setError("Content is required before generating a summary");
      return;
    }

    try {
      setLoadingAI(true);
      const response = await API.post("/ai/summarize", {
        noteId: isEditMode ? id : undefined,
        content,
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "AI summary failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateTags = async () => {
    setError("");
    if (!content.trim()) {
      setError("Content is required before generating tags");
      return;
    }

    try {
      setLoadingAI(true);
      const response = await API.post("/ai/generate-tags", {
        noteId: isEditMode ? id : undefined,
        content,
      });
      setTags(response.data.tags);
    } catch (err) {
      setError(err.response?.data?.message || "AI tag generation failed");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6 md:p-8">
          <div className="mb-6">
            <p className="inline-block mb-3 px-4 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
              {isEditMode ? "Edit mode" : "Create mode"}
            </p>
            <h1 className="text-3xl font-bold text-slate-800">
              {isEditMode ? "Edit Note" : "Create a New Note"}
            </h1>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-600">
                Title
              </label>
              <input
                type="text"
                placeholder="Ex: JWT Authentication"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-fuchsia-100 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-600">
                Content
              </label>
              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                className="w-full rounded-2xl border border-fuchsia-100 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={loadingAI}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
              >
                Generate Summary
              </button>

              <button
                type="button"
                onClick={handleGenerateTags}
                disabled={loadingAI}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
              >
                Generate Tags
              </button>

              <button
                type="submit"
                className="px-5 py-3 rounded-full bg-slate-800 text-white font-semibold shadow hover:bg-slate-700 transition"
              >
                Save Note
              </button>
            </div>
          </form>

          {summary && (
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-50 to-violet-50 border border-fuchsia-100 p-5">
              <h2 className="font-bold text-fuchsia-700 mb-2">AI Summary</h2>
              <p className="text-slate-700">{summary}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-slate-800 mb-3">AI Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default NoteEditor;