import { Link } from "react-router-dom";

function NoteCard({ note, onDelete }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg shadow-fuchsia-100 border border-white p-5 hover:-translate-y-1 hover:shadow-xl transition">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-slate-800 mb-1">{note.title}</h2>
        <p className="text-xs text-slate-400">
          {new Date(note.updatedAt || note.createdAt).toLocaleString()}
        </p>
      </div>

      <p className="text-slate-600 mb-4 leading-7">
        {note.content.length > 150
          ? note.content.slice(0, 150) + "..."
          : note.content}
      </p>

      {note.summary && (
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-pink-50 to-violet-50 border border-fuchsia-100 p-4">
          <p className="text-sm font-semibold text-fuchsia-700 mb-1">
            AI Summary
          </p>
          <p className="text-sm text-slate-600">{note.summary}</p>
        </div>
      )}

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to={`/notes/${note._id}`}
          className="flex-1 text-center px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow hover:opacity-95 transition"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(note._id)}
          className="flex-1 px-4 py-2.5 rounded-full bg-rose-100 text-rose-600 font-semibold hover:bg-rose-200 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;