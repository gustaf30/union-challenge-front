import { useState, useEffect } from "react";
import { createTask } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRouter } from "next/router";

export default function NewTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "0",
  });
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(task);
    router.push("/");
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen w-full p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl mb-4">NEW TASK</h1>
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
          <Input
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Description"
          />
        </div>
        <div className="mb-4">
          <Input
            type="date"
            value={task.dueDate ?? ""}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            placeholder="Due Date"
            required
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="outline"
            className="hover:bg-slate-400 transition-colors duration-200 ease-in-out"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
