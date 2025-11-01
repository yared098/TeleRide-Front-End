import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/wallet";

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const walletService = {
  async getWallet(token) {
    const res = await axios.get(`${API_URL}/me`, getHeaders(token));
    return res.data;
  },

  async topUpWallet(amount, token) {
    const res = await axios.post(`${API_URL}/topup`, { amount }, getHeaders(token));
    return res.data;
  },

  async payForRide(rideId, amount, token) {
    const res = await axios.post(`${API_URL}/pay`, { rideId, amount }, getHeaders(token));
    return res.data;
  },

  async tipDriver(driverId, rideId, amount, token) {
    const res = await axios.post(`${API_URL}/tip`, { driverId, rideId, amount }, getHeaders(token));
    return res.data;
  },
};
