import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Example fetch function (replace with API call)
const fetchRideHistory = async (userId) => {
  // Replace with your actual API call
  return [
    { id: 1, date: "2025-10-31", from: "Bole", to: "Addis Ababa", amount: 150 },
    { id: 2, date: "2025-10-30", from: "Kazanchis", to: "Bole", amount: 120 },
  ];
};

const RideHistory = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRides = async () => {
      if (!user) return;
      try {
        const data = await fetchRideHistory(user._id); // Use user._id from auth context
        setRides(data);
      } catch (err) {
        console.error("Error fetching ride history:", err);
      } finally {
        setLoading(false);
      }
    };

    getRides();
  }, [user]);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user...</p>;
  if (loading) return <p className="text-center mt-10 text-gray-500">Loading rides...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Ride History</h1>

      {rides.length === 0 ? (
        <p className="text-gray-500">No rides found.</p>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {ride.from} → {ride.to}
                </p>
                <p className="text-sm text-gray-500">{ride.date}</p>
              </div>
              <p className="font-semibold text-green-600">{ride.amount} ETB</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory;
