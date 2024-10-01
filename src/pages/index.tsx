import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  countTasks,
  fetchTasks,
  fetchTasksByTitle,
  fetchTasksOverdue,
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
  const [limit, setLimit] = useState<number>(5);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
      if (overdue) {
        await fetchTasksOverdue(overdue, page, limit, setTasks);
      } else {
        await fetchTasks(filter, page, limit, setTasks, router);
      }
    };
    fetchTasksData();
  }, [filter, page, limit, overdue]);

  useEffect(() => {
    const fetchTasksBySearch = async () => {
      if (search) {
        const results = await fetchTasksByTitle(search);
        setTasks(results);
      }
    };
    fetchTasksBySearch();
  }, [search]);

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        setDeleteDialogOpen(false);
        fetchTasks(filter, page, limit, setTasks, router);
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
          <DarkModeToggle
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>
      </header>

      <div className="mb-6 flex justify-start flex-wrap">
        <Button
          onClick={() => setFilter("")}
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
          onClick={() => setFilter("0")}
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
          onClick={() => setFilter("1")}
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
          onClick={() => setFilter("2")}
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
            setOverdue(!overdue);
            fetchTasksOverdue(overdue, page, limit, setTasks);
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
          onChange={(e) => setSearch(e.target.value)}
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
        />
      </div>

      <TaskCard
        search={search}
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
      />
    </div>
  );
};

export default Home;
