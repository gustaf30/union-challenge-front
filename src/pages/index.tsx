import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TaskCard } from '../components/taskcard';
import { Pagination } from '../components/pagination';
import { DarkModeToggle } from '../components/darkmodetoggle';
import { countTasks, fetchTasks, fetchTasksByTitle, fetchTasksOverdue } from '../services/taskservice';
import { DialogDeleteTask } from '../components/dialogdeletetask';
import { deleteTask } from '@/services/api';
import { Task } from '../lib/task.types';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('');
  const [overdue, setOverdue] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <div className={`flex flex-col min-h-screen w-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <a href="./">To Do List</a>
        </h1>
        <div className="flex space-x-4">
          <Button onClick={() => router.push('/new')}>New Task</Button>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-1/4 ${darkMode ? 'border-blue-900 text-white' : ''}`}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} darkMode={darkMode} onDelete={() => openDeleteDialog(task.id)} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        darkMode={darkMode}
      />

      <DialogDeleteTask
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Home;
