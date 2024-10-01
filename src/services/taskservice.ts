import { getTasks, deleteTask, searchTasksByTitle, getTasksCount } from "./api";

export const fetchTasks = async (
  filter: any,
  page: any,
  limit: any,
  setTasks: any,
  router: any
) => {
  router.push(`?page=${page}&limit=${limit}`);

  try {
    const data = await getTasks(filter, page, limit, undefined);
    setTasks(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const fetchTasksByTitle = async (search: any) => {
  if (!search) return [];

  try {
    const data = await searchTasksByTitle(search);
    return data;
  } catch (error) {
    console.error("Error searching tasks by title:", error);
    return [];
  }
};

export const fetchTasksOverdue = async (
  overdue: boolean,
  page: number,
  limit: number,
  setTasks: any
) => {
  try {
    let data;
    if (overdue) {
      data = await getTasks("", page, limit, { overdue: true });
    } else {
      data = await getTasks("", page, limit, undefined);
    }
    setTasks(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const countTasks = async () => {
  try {
    const data = await getTasksCount();
    return data;
  } catch (error) {
    console.error("Error counting tasks:", error);
    return 0;
  }
};
