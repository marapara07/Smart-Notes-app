import { useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function AskNotes() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setError("");
    setAnswer("");
    setSources([]);

    if (!question.trim()) {
      setError("Question is required");
      return;
    }

    try {
      const response = await API.post("/ai/ask-notes", { question });
      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
    } catch (err) {
      setError(err.response?.data?.message || "Ask Your Notes failed");
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6 md:p-8 mb-6">
          <p className="inline-block mb-3 px-4 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
            AI feature
          </p>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Ask Your Notes
          </h1>
          <p className="text-slate-600 mb-5">
            Ask questions in natural language and get answers based on your notes.
          </p>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleAsk} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Ex: What did I write about ...?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 rounded-2xl border border-fuchsia-100 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
            />

            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold shadow">
              Ask
            </button>
          </form>
        </div>

        {answer && (
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">AI Answer</h2>
            <p className="whitespace-pre-line text-slate-700 leading-7">
              {answer}
            </p>
          </div>
        )}

        {sources.length > 0 && (
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Retrieved Notes
            </h2>

            <div className="space-y-4">
              {sources.map((item) => (
                <div
                  key={item.note._id}
                  className="rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-pink-50 to-violet-50 p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-800">{item.note.title}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-white text-fuchsia-700 text-sm font-medium">
                      Score: {item.score.toFixed(4)}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default AskNotes;