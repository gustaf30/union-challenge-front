import { useState, useEffect } from 'react';
import { getTask, updateTask } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function EditTask() {
  const [task, setTask] = useState({ title: '', description: '', dueDate: '', status: '0' });
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setDarkMode(false);
      document.body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (id) => {
    const taskToEdit = await getTask(id);
    setTask(taskToEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTask(id, task);
    router.push('/');
  };

  return (
    <div className={`flex flex-col justify-center items-center min-h-screen w-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl mb-4">EDIT TASK</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            value={task.title ?? ' '}
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
            value={task.dueDate ?? ''}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            placeholder="Due Date"
          />
        </div>
        <div className="mb-4 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel>Select status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem value={task.status}
                  onClick={() => setTask({ ...task, status: "0" })}
                  className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  Pending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={task.status}
                  onClick={() => setTask({ ...task, status: "1" })}
                  className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  In progress
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={task.status}
                  onClick={() => setTask({ ...task, status: "2" })}
                  className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  Completed
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-center">
          <Button type="submit" variant="outline" className="hover:bg-slate-400 transition-colors duration-200 ease-in-out">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
