import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createTask } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRouter } from "next/router";
import { Task, TaskStatus } from "../lib/task.types";
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
    CardTitle
} from "../components/ui/card"
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function NewTaskComponent() {
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
        router.push("/");
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
        if (!date) return "Select due date";

        const parsedDate = new Date(date);

        return !isNaN(parsedDate.getTime())
            ? parsedDate.toLocaleDateString()
            : "Invalid date";
    };

    return (
        <div
            className={`flex flex-col justify-center items-center min-h-screen w-full p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                }`}
        >
            <Card>
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
                                value={task.description ?? ''}
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
                                            console.log(newDate)
                                            await setTask({ ...task, dueDate: newDate });
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <CardFooter className="justify-center items-center">
                            <Button
                                type="submit"
                                variant="outline"
                                className="hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                            >
                                Create Task
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
