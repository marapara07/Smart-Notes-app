import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow"
        : "text-slate-700 hover:bg-fuchsia-50 hover:text-fuchsia-700"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-violet-500 shadow-lg flex items-center justify-center text-white text-xl font-bold">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Smart Notes
            </h1>
            <p className="text-xs text-slate-500">
              AI notes app with summaries, search & RAG
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/semantic-search" className={linkClass}>
            Search in Notes
          </NavLink>
          <NavLink to="/ask-notes" className={linkClass}>
            Ask Notes
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="font-semibold text-slate-700">{user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white font-semibold shadow hover:scale-[1.02] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;