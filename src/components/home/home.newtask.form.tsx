import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createTask } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/router";
import { Task, TaskStatus } from "../../lib/task.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function NewTaskForm({
  onClose,
  onTaskCreated,
}: {
  onClose: () => void;
  onTaskCreated: () => void;
}) {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    dueDate: undefined,
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined,
  });
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [date, setNewDate] = useState<Date | undefined>(task.dueDate);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createTask(task);
    onTaskCreated();
    onClose();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
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

  return (
    <Card
      className={`flex flex-col justify-center items-center p-6 ${
        darkMode
          ? "border-gray-900 bg-gray-900 text-white"
          : "bg-white text-black"
      }`}
    >
      <CardHeader className="justify-center items-center">
        <CardTitle className="text-2xl mb-4 font-bold">New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              name="title"
              value={task.title}
              onChange={handleInputChange}
              placeholder="Task Title"
              required
            />
          </div>
          <div className="mb-4">
            <Textarea
              name="description"
              value={task.description ?? ""}
              onChange={handleTextAreaChange}
              placeholder="Description"
            />
          </div>
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
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
          <CardFooter className="justify-center items-center">
            <Button
              type="submit"
              className={`${
                darkMode
                  ? "bg-blue-950 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-100"
              }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
            >
              Create Task
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
