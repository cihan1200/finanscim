import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/expense`;

export const fetchExpenses = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveExpenses = (token, expenses) => {
  return axios.post(
    API_URL,
    { expenses },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteExpense = (token, id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
