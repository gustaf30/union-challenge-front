import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getTasks = async (status, page, limit) => {
  const response = await api.get('/tasks', { params: { status, page, limit } });
  return response.data;
};

export const searchTasksByTitle = async (title) => {
  const response = await api.get(`/tasks/search/${title}`);
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await api.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
