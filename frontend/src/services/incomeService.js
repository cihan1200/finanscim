import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/income`;

export const fetchIncomes = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveIncomes = (token, incomes) => {
  return axios.post(
    API_URL,
    { incomes },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteIncome = (token, id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
