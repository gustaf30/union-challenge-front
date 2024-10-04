import { getTasks, deleteTask, searchTasksByTitle, getTasksCount } from "./api";

export const fetchTasks = async (setTasks: any, url: any, router: any) => {
  const filter = url.searchParams.get("status");
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  const overdue = url.searchParams.get("overdue");

  if (overdue == "true") {
    router.push(`?page=${page}&limit=${limit}&overdue=${overdue}`);
    try {
      const data = await getTasks(filter, page, limit, overdue);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  } else {

    try {
      if (filter == "") {
        router.push(
          `?status=all&page=${page}&limit=${limit}`
        );
        const data = await getTasks(filter, page, limit, undefined);
        setTasks(data);
      } else {
        router.push(
          `?status=${filter}&page=${page}&limit=${limit}&overdue=${overdue}`
        );
        const data = await getTasks(filter, page, limit, overdue)
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
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

export const countTasks = async () => {
  try {
    const data = await getTasksCount();
    return data;
  } catch (error) {
    console.error("Error counting tasks:", error);
    return 0;
  }
};
