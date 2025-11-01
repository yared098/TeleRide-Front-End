import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory, FaCarSide, FaWallet } from "react-icons/fa";

import RideHistory from "./RideHistor";
import RideRequest from "./RideRequest";
import Wallet from "./Wallet";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("rideHistory");

  // Disable page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-100 to-white flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full h-[99vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-3xl shadow-md">
          <h1 className="text-lg font-semibold">Welcome, {user.firstName || "Passenger"} 👋</h1>
          <span className="text-sm opacity-90">Teleride</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          {[
            { id: "rideHistory", label: "History", icon: <FaHistory /> },
            { id: "requestRide", label: "Request", icon: <FaCarSide /> },
            { id: "wallet", label: "Wallet", icon: <FaWallet /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-green-600 border-b-4 border-green-500 bg-green-50 font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Animated Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "rideHistory" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-y-auto no-scrollbar p-4"
              >
                <RideHistory />
              </motion.div>
            )}
            {activeTab === "requestRide" && (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-y-auto no-scrollbar p-0"
              >
                <RideRequest />
              </motion.div>
            )}
            {activeTab === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-y-auto no-scrollbar p-4"
              >
                <Wallet />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
