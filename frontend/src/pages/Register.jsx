import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white rounded-3xl shadow-2xl shadow-fuchsia-100 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-3xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-violet-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-500 mt-2">
            Start organizing your notes with AI
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-fuchsia-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
          />

          <input
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-fuchsia-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
          />

          <input
            name="password"
            type="password"
            placeholder="Choose a password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-fuchsia-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-300"
          />

          <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold shadow-lg shadow-fuchsia-200 hover:scale-[1.01] transition">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-fuchsia-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;