import axios from 'axios';

const API_URL = 'https://carecycle-2.onrender.com/api';

export const getDonations = async () => {
  const response = await axios.get(`${API_URL}/donations`);
  return response.data;
};

export const verifyDonation = async (id) => {
  const response = await axios.patch(`${API_URL}/donations/${id}/verify`);
  return response.data;
};

export const deleteDonation = async (id) => {
  const response = await axios.delete(`${API_URL}/donations/${id}`);
  return response.data;
};
