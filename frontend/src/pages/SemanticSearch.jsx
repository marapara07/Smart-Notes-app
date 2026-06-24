import { useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);

    if (!query.trim()) {
      setError("Search query is required");
      return;
    }

    try {
      const response = await API.post("/ai/semantic-search", { query });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Semantic search failed");
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6 md:p-8 mb-6">
          <p className="inline-block mb-3 px-4 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold">
            You remember the topic, but can't find the note? No worries!
          </p>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Search in your notes
          </h1>
          <p className="text-slate-600 mb-5">
            Search notes by meaning, not only by exact words.
          </p>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Introduce your ideas here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-2xl border border-fuchsia-100 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
            />

            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold shadow">
              Search
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {results.map((item) => (
            <div
              key={item.note._id}
              className="rounded-3xl bg-white/85 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <h2 className="text-xl font-bold text-slate-800">
                  {item.note.title}
                </h2>
                <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                  Score: {item.score.toFixed(4)}
                </span>
              </div>

              <p className="text-slate-600 mb-3 leading-7">{item.note.content}</p>

              {item.note.summary && (
                <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-violet-50 border border-fuchsia-100 p-4">
                  <p className="font-semibold text-fuchsia-700 mb-1">
                    Summary
                  </p>
                  <p className="text-slate-700">{item.note.summary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default SemanticSearch;