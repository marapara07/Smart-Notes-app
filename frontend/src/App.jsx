import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import SemanticSearch from "./pages/SemanticSearch";
import AskNotes from "./pages/AskNotes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/new"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/semantic-search"
        element={
          <ProtectedRoute>
            <SemanticSearch />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ask-notes"
        element={
          <ProtectedRoute>
            <AskNotes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
