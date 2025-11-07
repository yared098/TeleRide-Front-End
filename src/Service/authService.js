import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth"; 
const API_URL = import.meta.env.VITE_API_URL;


// ✅ Save user + token helper
const saveAuthData = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

// 🔹 Telegram login
export const telegramLogin = async (initData) => {
  try {
    const res = await axios.post(`${API_URL}/telegram`, { initData });
    console.log("📩 Telegram login response:", res.data); // <- log response
    if (res.data.ok && res.data.user && res.data.token) {
      saveAuthData(res.data.user, res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error("❌ Telegram login error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Register user
export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    console.log("📩 Register response:", res.data); // <- log response
    if (res.data.ok && res.data.user && res.data.token) {
      saveAuthData(res.data.user, res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error("❌ Register error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Login user
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/login`, data);
    console.log("📩 Login response:", res.data); // <- log response
    if (res.data.ok && res.data.user && res.data.token) {
      saveAuthData(res.data.user, res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    throw err;
  }
};
