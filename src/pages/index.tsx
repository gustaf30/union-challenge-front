import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
import { Card } from "@/components/ui/card";

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
  }, []);

  useEffect(() => {
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

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const formatDueDate = (date?: Date): string => {
    if (!date) return "No due date provided";

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString()
      : "Invalid date";
  };

  const prevPage = () => {
    if (page == 1) return;
    setPage(page - 1);
  };

  const nextPage = () => {
    if (page == totalPages && page != 1) return;
    setPage(page + 1);
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
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className={`${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            } transition-colors duration-200 ease-in-out`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={`${
                darkMode
                  ? "bg-blue-950 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-100"
              } px-4 py-2 ml-2 rounded-md cursor-pointer`}
            >
              Show
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`${
              darkMode ? "bg-blue-950 text-white" : "bg-white"
            } px-4 py-2 ml-2 rounded-md cursor-pointer`}
          >
            <DropdownMenuLabel>Number of Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <DropdownMenuRadioItem
                value="5"
                className={`${
                  darkMode
                    ? "bg-blue-950 hover:bg-blue-900 text-white"
                    : "bg-white hover:bg-gray-100"
                } transition-colors duration-200 ease-in-out w-56 rounded-md`}
              >
                5
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="10"
                className={`${
                  darkMode
                    ? "bg-blue-950 hover:bg-blue-900 text-white"
                    : "bg-white hover:bg-gray-100"
                } transition-colors duration-200 ease-in-out w-56 rounded-md`}
              >
                10
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="20"
                className={`${
                  darkMode
                    ? "bg-blue-950 hover:bg-blue-900 text-white"
                    : "bg-white hover:bg-gray-100"
                } transition-colors duration-200 ease-in-out w-56 rounded-md`}
              >
                20
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {tasks
                .filter((task) =>
                  task.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${
                          darkMode
                            ? "bg-gray-950 hover:bg-gray-900"
                            : "bg-white hover:bg-gray-100"
                        } transition-colors duration-300 ease-in-out shadow-lg p-4`}
                      >
                        <h2 className="text-xl font-semibold mb-2">
                          {task.title}
                        </h2>
                        <p
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          } text-sm mb-4 font-bold`}
                        >
                          {task.description}
                        </p>
                        <p
                          className={`text-sm text-gray-600 mb-4 font-bold ${
                            new Date(formatDueDate(task.dueDate)) <= new Date()
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatDueDate(task.dueDate)}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => router.push(`/edit/${task.id}`)}
                              className={`${
                                darkMode
                                  ? "bg-blue-950 hover:bg-blue-900"
                                  : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openDeleteDialog(task.id)}
                              className={`${
                                darkMode
                                  ? "bg-red-900 text-white hover:bg-red-800"
                                  : "bg-red-500 text-white hover:bg-red-600"
                              } px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className={`${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <DialogHeader>
            <DialogTitle>Confirm exclusion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button
                className={`${
                  darkMode
                    ? "bg-blue-950 hover:bg-blue-900"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteTask}
              className={`${
                darkMode
                  ? "bg-red-900 hover:bg-red-800"
                  : "bg-red-500 hover:bg-red-600"
              } text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Pagination className="mt-auto flex justify-center items-center py-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              className={`${
                darkMode
                  ? "bg-blue-950 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-100"
              }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationEllipsis />
          <PaginationItem>
            <PaginationLink>{totalPages}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              className={`${
                darkMode
                  ? "bg-blue-950 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-100"
              }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Home;
