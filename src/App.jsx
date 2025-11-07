// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";

// // Pages
// import Register from "./components/register";
// import Login from "./components/login";
// import Dashboard from "./components/Dashboard";

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div className="p-6 text-center">Loading...</div>;
//   return user ? children : <Navigate to="/login" />;
// };

// const AppRoutes = () => {
//   const { user, loading } = useAuth();

//   if (loading) return <div className="p-6 text-center">Loading...</div>;

//   // If authenticated via Telegram, go directly to dashboard
//   if (user && window.Telegram?.WebApp?.initData) {
//     return (
//       <Routes>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="*" element={<Navigate to="/dashboard" />} />
//       </Routes>
//     );
//   }

//   // Otherwise, show login/register routes
//   return (
//     <Routes>
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/dashboard"
//         element={
//           <PrivateRoute>
//             <Dashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// };

// const App = () => (
//   <AuthProvider>
//     <Router>
//       <AppRoutes />
//     </Router>
//   </AuthProvider>
// );

// export default App;


import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { telegramLogin } from "./Service/authService";

// Pages
import Register from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user, login, loading } = useAuth();
  const [telegramLoading, setTelegramLoading] = useState(true);

  useEffect(() => {
    const initTelegramLogin = async () => {
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        try {
          const res = await telegramLogin(initData); // Call backend
          if (res.ok && res.user && res.token) {
            login(res.user); // Update AuthContext
          }
        } catch (err) {
          console.error("Telegram login failed:", err);
        } finally {
          setTelegramLoading(false);
        }
      } else {
        setTelegramLoading(false);
      }
    };

    initTelegramLogin();
  }, []);

  if (loading || telegramLoading) return <div className="p-6 text-center">Loading...</div>;

  if (user) {
    // Authenticated (normal login or Telegram)
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Otherwise, normal login/register routes
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
