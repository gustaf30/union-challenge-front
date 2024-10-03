import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useDebounce } from "use-debounce";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  countTasks,
  fetchTasks,
  fetchTasksByTitle,
} from "../services/taskservice";

import { deleteTask } from "@/services/api";
import { Task } from "../lib/task.types";
import { HomePagination } from "../components/home/home.pagination";
import { DialogDeleteTask } from "@/components/home/home.dialog.deletetask";
import { TaskCard } from "@/components/home/home.taskcard";
import { ShowMenu } from "@/components/home/home.showmenu";
import { DarkModeToggle } from "@/components/home/home.darkmodetoggle";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [overdue, setOverdue] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();
  let url = new URL(
    `http://localhost:3001?status=${filter}&page=${page}&limit=${limit}&overdue=${overdue}`
  );
  const [params, setParams] = useState<URLSearchParams>(
    new URLSearchParams(url.search)
  );
  const [debounce] = useDebounce(search, 500);

  useEffect(() => {
    document.title = "To do List";
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark");
    }
    
    countTasks().then(setTotalTasks);
  }, []);

  useEffect(() => {
    if (totalTasks && limit) {
      setTotalPages(Math.ceil(totalTasks / limit));
    }
  }, [totalTasks, limit]);

  useEffect(() => {
    const fetchTasksData = async () => {
      await fetchTasks(setTasks, url, router);
    };
    fetchTasksData();
  }, [params]);

  useEffect(() => {
    if (debounce == "") {
      fetchTasks(setTasks, url, router);
    } else {
      router.push(`?search=${debounce}`);
      const titleSearch = async () => {
        const results = await fetchTasksByTitle(debounce);
        setTasks(results);
      };
      titleSearch();
    }
  }, [debounce]);

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        setDeleteDialogOpen(false);
        fetchTasks(setTasks, url, router);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <a href="./">To do List</a>
        </h1>
        <div className="flex space-x-4">
          <Button
            onClick={() => router.push("/new")}
            className={`${
              darkMode
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
          >
            New Task
          </Button>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      <div className="mb-6 flex justify-start flex-wrap">
        <Button
          onClick={() => {
            setFilter("");
            setOverdue(false);
            setSearch("")
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("status", filter);
            setParams(updatedParams);
          }}
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          All
        </Button>
        <div className="mr-2"></div>
        <Button
          onClick={() => {
            setFilter("0");
            setOverdue(false);
            setSearch("")
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("status", filter);
            setParams(updatedParams);
          }}
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          Pending
        </Button>
        <div className="mr-2"></div>
        <Button
          onClick={() => {
            setFilter("1");
            setOverdue(false);
            setSearch("")
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("status", filter);
            setParams(updatedParams);
          }}
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          In Progress
        </Button>
        <div className="mr-2"></div>
        <Button
          onClick={() => {
            setFilter("2");
            setOverdue(false);
            setSearch("")
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("status", filter);
            setParams(updatedParams);
          }}
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          Completed
        </Button>
        <div className="mr-2"></div>
        <Button
          onClick={() => {
            setFilter("");
            setOverdue(!overdue);
            setSearch("")
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("status", filter);
            updatedParams.set("overdue", overdue.toString());
            setParams(updatedParams);
          }}
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          Overdue
        </Button>
        <div className="mr-2"></div>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            const searchValue = e.target.value;
            router.push(`?search=${searchValue}`);
            setSearch(searchValue);
          }}
          className={`${
            darkMode
              ? "border-blue-900 hover:border-blue-800 text-white"
              : "hover:border-gray-500"
          } w-1/4 border transition-colors duration-200 ease-in-out rounded-md`}
        />

        <ShowMenu
          darkMode={darkMode}
          limit={limit}
          setLimit={setLimit}
          totalTasks={totalTasks}
          params={params}
          setParams={setParams}
        />
      </div>

      <TaskCard
        debounce={debounce}
        darkMode={darkMode}
        tasks={tasks}
        router={router}
        setTaskToDelete={setTaskToDelete}
        setDeleteDialogOpen={setDeleteDialogOpen}
        setTasks={setTasks}
      />

      <DialogDeleteTask
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        darkMode={darkMode}
        handleDeleteTask={handleDeleteTask}
      />

      <HomePagination
        page={page}
        totalPages={totalPages}
        darkMode={darkMode}
        setPage={setPage}
        params={params}
        setParams={setParams}
      />
    </div>
  );
};

export default Home;
