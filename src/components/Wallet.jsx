import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaTimes } from "react-icons/fa";
import { walletService } from "../Service/walletService";

const Wallet = () => {
  const { user, token } = useAuth();
  console.log("the token is "+token);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await walletService.getWallet(token);
        setBalance(data.wallet.balance);
        setHistory(data.transactions.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchWallet();
  }, [token]);

  const handleTopUp = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await walletService.topUpWallet(amt, token);
      setBalance(res.wallet.balance);
      setHistory([res.txn, ...history]);
      setMessage(`Wallet topped up by ${amt.toFixed(2)} ETB`);
      setAmount("");
      setShowBottomSheet(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to top up wallet");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center mb-6 animate-fadeIn">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Current Balance: <span className="text-green-600">{balance.toFixed(2)} ETB</span>
        </p>
        <button
          onClick={() => setShowBottomSheet(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition transform hover:scale-105 shadow-lg"
        >
          Top Up
        </button>
      </div>

      {/* Wallet History */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Wallet History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((txn) => (
              <li
                key={txn._id || txn.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:bg-gray-100 transition"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{txn.type}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(txn.createdAt || txn.date).toLocaleString()}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    txn.type === "topup" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {txn.type === "topup" ? "+" : "-"}{txn.amount.toFixed(2)} ETB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Sheet for Top-Up */}
      {showBottomSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Top Up Wallet</h3>
              <button
                onClick={() => setShowBottomSheet(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-sm mb-4"
            />

            <button
              onClick={handleTopUp}
              disabled={loading}
              className={`w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition transform hover:scale-105 shadow-lg ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Top Up"}
            </button>

            {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
