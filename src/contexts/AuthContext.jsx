import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper: Check if token expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // ✅ Auto Telegram authentication (first time or expired token)
  useEffect(() => {
    const telegramAuth = async () => {
      try {
        if (window.Telegram?.WebApp?.initData) {
          const initData = window.Telegram.WebApp.initData;

          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/telegram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          });

          const data = await res.json();

          if (data.ok && data.user && data.token) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
          } else {
            console.warn("Telegram auth failed:", data.message);
            logout(); // fallback
          }
        } else {
          console.warn("No Telegram initData found");
          logout();
        }
      } catch (err) {
        console.error("Telegram Auth Error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    // ✅ If no user or token expired → reauthenticate
    if (!user || !token || isTokenExpired(token)) {
      telegramAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = ({ user: userData, token: authToken }) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
