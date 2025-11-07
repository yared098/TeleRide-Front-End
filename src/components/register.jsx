import React, { useState } from "react";
import { registerUser } from "../Service/authService";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser(form);
      if (res.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-green-200">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/50 border border-white/20 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-wide">
          Create Your TeleRide Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium shadow">
            {error}
          </div>
        )}

        {success && (
          <div classNaame="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-medium shadow animate-pulse">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="peer w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-sm"
              required
            />
            <FaUser className="absolute top-3 left-3 text-green-500 text-xl" />
            <label className="absolute left-12 top-3 text-gray-500 text-sm transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-0 peer-focus:text-green-600 peer-focus:text-sm">
              Enter username
            </label>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition transform hover:scale-105 shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-gray-800 text-sm text-center mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline hover:text-green-700 transition"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
