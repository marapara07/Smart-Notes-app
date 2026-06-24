import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");


  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
     const fetchNotes = async () => {
    try {
      const response = await API.get("/notes");
      setNotes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    }
  };
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="inline-block mb-3 px-4 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold">
                Your AI workspace
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                My Notes
              </h2>
              <p className="text-slate-600 max-w-2xl">
                Create, edit, summarize and search your personalized notes.
              </p>
            </div>

            <Link
              to="/notes/new"
              className="inline-flex justify-center items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold shadow-lg shadow-fuchsia-200 hover:scale-[1.02] transition"
            >
              + Create Note
            </Link>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3">
            {error}
          </div>
        )}

        {notes.length === 0 ? (
          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-lg shadow-fuchsia-100 p-10 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No notes yet
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first note and test summaries, tags, semantic search
              and Ask Notes.
            </p>
            <Link
              to="/notes/new"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold"
            >
              Add First Note
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={deleteNote} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;