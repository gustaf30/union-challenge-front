import axios from "axios";
import { Task, TaskStatus } from "../lib/task.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getTasks = async (
  status?: string,
  page: number = 1,
  limit: number = 5,
  params: { overdue?: boolean } = {}
): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>("/tasks", {
      params: {
        status: status || "",
        page,
        limit,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTasksCount = async (): Promise<number> => {
  try {
    const response = await api.get<number>("/tasks/count");
    return response.data;
  } catch (error) {
    console.error("Error counting tasks:", error);
    throw error;
  }
};

export const searchTasksByTitle = async (title: string): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>(`/tasks/search/${title}`);
    return response.data;
  } catch (error) {
    console.error("Error searching tasks by title:", error);
    throw error;
  }
};

export const getTask = async (id: string): Promise<Task> => {
  try {
    const response = await api.get<Task>(`/tasks/find/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  try {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id: string, task: Task): Promise<Task> => {
  try {
    const response = await api.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw error;
  }
};
