// src/hooks/useRideSocket.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000/ride";

export const useRideSocket = (token, user, setRide, setMessage, setSuccess, setShowSheet) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Ride socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Ride socket disconnected");
      setConnected(false);
    });

    socket.on("ride:status", (updatedRide) => {
      console.log("📦 Ride status update received:", updatedRide);

      if (updatedRide.passenger._id === user._id) {
        setRide(updatedRide);
        setShowSheet(true);

        let msg = "";
        switch (updatedRide.status) {
          case "accepted": msg = "✅ Driver accepted your ride!"; break;
          case "trip_start": msg = "🚗 Trip started!"; break;
          case "trip_ongoing": msg = "🛣️ Trip ongoing..."; break;
          case "trip_completed": msg = "🎉 Trip completed!"; break;
          case "cancelled": msg = "❌ Ride was cancelled."; break;
          default: msg = `Ride status: ${updatedRide.status}`;
        }

        setMessage(msg);
        setSuccess(true);

        if (updatedRide.status === "trip_completed") {
          setTimeout(() => {
            setRide(null);
            setShowSheet(false);
            setMessage("");
          }, 4000);
        }
      }
    });

    return () => socket.disconnect();
  }, [token, user]);

  // ✅ Emit ride request
  const requestRide = (rideData) => {
    if (!socketRef.current) return;
    console.log("📤 Emitting ride:request:", rideData);
    socketRef.current.emit("ride:request", rideData);
  };

  // ✅ Emit cancel ride
  const cancelRide = (rideId) => {
    if (!socketRef.current) return;
    console.log("📤 Emitting ride:cancel:", rideId);
    socketRef.current.emit("ride:cancel", { rideId });
  };

  // ✅ Emit live location (for drivers)
  const sendLocation = (driverId, lat, lng) => {
    if (!socketRef.current) return;
    socketRef.current.emit("driver:location", { driverId, lat, lng });
  };

  return { connected, socketRef, requestRide, cancelRide, sendLocation };
};
