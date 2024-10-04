import { useState, useEffect, FormEvent } from "react";
import { getTask, updateTask } from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useRouter } from "next/router";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskStatus } from "../../lib/task.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export default function EditTask() {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    dueDate: undefined,
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  });

  const [date, setNewDate] = useState<Date | undefined>(task.dueDate);

  const router = useRouter();
  const { id } = router.query as { id: string };
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (id: string) => {
    const taskToEdit: Task = await getTask(id);

    const dueDate =
      typeof taskToEdit.dueDate === "string"
        ? new Date(taskToEdit.dueDate)
        : taskToEdit.dueDate;

    setTask({
      ...taskToEdit,
      description: taskToEdit.description ?? "",
      dueDate: dueDate ?? undefined,
      deletedAt: taskToEdit.deletedAt ?? undefined,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateTask(id, task);
    router.push("/");
  };

  const formatDueDate = (date?: Date): string => {
    if (!date) return "No due date provided";

    const parsedDate = new Date(date);

    if (date.getHours() != 0) {
      parsedDate.setHours(0, 0, 0, 0);
      parsedDate.setDate(parsedDate.getDate() + 1);
    }

    return !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString()
      : "Invalid date";
  };

  const enumToString = (status: TaskStatus): string => {
    if (status == TaskStatus.PENDING) return "Pending";
    if (status == TaskStatus.IN_PROGRESS) return "In progress";
    if (status == TaskStatus.COMPLETED) return "Completed";
    return "Status";
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen w-full p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Card>
        <CardHeader className="justify-center items-center">
          <CardTitle className="text-2xl mb-4 font-bold">Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task Title"
                required
              />
            </div>
            <div className="mb-4">
              <Textarea
                value={task.description ?? ""}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                placeholder="Description"
              />
            </div>
            <div className="mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      `${
                        darkMode
                          ? "bg-blue-950 hover:bg-blue-900 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`,
                      "w-[240px] justify-start text-left font-normal",
                      !task.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDueDate(task.dueDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={async (e) => {
                      if (!e) return;
                      const newDate = new Date(e.toString());
                      setNewDate(newDate);
                      await setTask({ ...task, dueDate: newDate });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4 flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`${
                      darkMode
                        ? "bg-blue-950 hover:bg-blue-900 text-white"
                        : "bg-white hover:bg-gray-100"
                    }  transition-colors duration-200 ease-in-out px-4 py-2 rounded-md w-full`}
                  >
                    {!task.status ? "Status" : enumToString(task.status)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={task.status}>
                    <DropdownMenuRadioItem
                      value={TaskStatus.PENDING}
                      onClick={() =>
                        setTask({ ...task, status: TaskStatus.PENDING })
                      }
                      className="hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    >
                      Pending
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={TaskStatus.IN_PROGRESS}
                      onClick={() =>
                        setTask({ ...task, status: TaskStatus.IN_PROGRESS })
                      }
                      className="hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    >
                      In progress
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={TaskStatus.COMPLETED}
                      onClick={() =>
                        setTask({ ...task, status: TaskStatus.COMPLETED })
                      }
                      className="hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    >
                      Completed
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardFooter className="justify-center items-center">
              <Button
                type="submit"
                className={`${
                  darkMode
                    ? "bg-blue-950 hover:bg-blue-900 text-white"
                    : "bg-white hover:bg-gray-100"
                }  transition-colors duration-200 ease-in-out px-4 py-2 rounded-md`}
              >
                Save changes
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
