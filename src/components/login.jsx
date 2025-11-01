import React, { useState } from "react";
import { loginUser } from "../Service/authService";
import { useAuth } from "../contexts/AuthContext";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res.ok) {
        login(res.user);
        navigate("/dashboard"); // Go directly to dashboard

      }
    } catch (err) {
      // Friendly frontend message
      setError("Server Error"); 
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-green-200">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/50 border border-white/20 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-wide">
          TeleRide
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium shadow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="peer w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-sm"
              required
            />
            <FaEnvelope className="absolute top-3 left-3 text-green-500 text-xl" />
            <label className="absolute left-12 top-3 text-gray-500 text-sm transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-0 peer-focus:text-green-600 peer-focus:text-sm">
              Enter your email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="peer w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-sm"
              required
            />
            <FaLock className="absolute top-3 left-3 text-green-500 text-xl" />
            <label className="absolute left-12 top-3 text-gray-500 text-sm transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-0 peer-focus:text-green-600 peer-focus:text-sm">
              Enter password
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition transform hover:scale-105 shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-800 text-sm text-center mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-green-600 font-semibold hover:underline hover:text-green-700 transition"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
