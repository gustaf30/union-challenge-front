import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createTask } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRouter } from "next/router";
import { Task, TaskStatus } from "../lib/task.types";

interface NewTask {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
}

export default function NewTaskComponent() {
    const [task, setTask] = useState<NewTask>({
        title: "",
        description: "",
        dueDate: "",
        status: TaskStatus.PENDING,
    });
    const router = useRouter();
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const dueDateAsDate = new Date(task.dueDate);

        const newTask: Task = {
            ...task,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: dueDateAsDate,
        };

        await createTask(newTask);
        router.push('/');
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    return (
        <div
            className={`flex flex-col justify-center items-center min-h-screen w-full p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                }`}
        >
            <h1 className="text-2xl mb-4">NEW TASK</h1>
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
                    <Input
                        name="description"
                        value={task.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="date"
                        name="dueDate"
                        value={task.dueDate ?? ""}
                        onChange={handleInputChange}
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
