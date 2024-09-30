import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TaskCard } from '../components/taskcard';
import { Pagination } from '../components/pagination';
import { DarkModeToggle } from '../components/darkmodetoggle';
import { countTasks, fetchTasks, fetchTasksByTitle, fetchTasksOverdue } from '../services/taskservice';
import { DialogDeleteTask } from '../components/dialogdeletetask';
import { deleteTask } from '@/services/api';
import { Task } from '../lib/task.types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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


// Atualize para salvar o estado no localStorage
const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('darkMode', newMode.toString());
  if (newMode) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

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

  const renderBadge = (status: string) => {
    switch (status) {
      case '0':
        return <Badge color='yellow'>Pending</Badge>;
      case '1':
        return <Badge color="blue">In Progress</Badge>;
      case '2':
        return <Badge color="green">Completed</Badge>;
      default:
        return null;
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

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Data não disponível';
    
    // Se o date for uma string, tentar convertê-lo para um objeto Date
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    // Verifica se parsedDate é uma instância válida de Date
    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida';
    }
  
    return parsedDate.toLocaleDateString();
  };

  return (
    <div className={`flex flex-col min-h-screen w-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <a href='./'>To do List</a>
        </h1>
        <div className="flex space-x-4">
          <Button onClick={() => router.push('/new')} className={`bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md`}>
            New Task
          </Button>
          <Button onClick={toggleDarkMode} className={`bg-gray-200 text-black hover:bg-gray-300 transition-colors duration-200 ease-in-out`}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </header>
      
      <div className="mb-6 flex justify-start flex-wrap">
        <Button onClick={() => setFilter('')} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">All</Button>
        <Button onClick={() => setFilter('0')} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">Pending</Button>
        <Button onClick={() => setFilter('1')} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">In Progress</Button>
        <Button onClick={() => setFilter('2')} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">Completed</Button>
        <Button onClick={() => { setOverdue(!overdue); fetchTasksOverdue(overdue, page, limit, setTasks); }} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">Overdue</Button>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border hover:border-gray-500 w-1/4 transition-colors duration-200 ease-in-out rounded-md"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md">Show</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`bg-white`}>
            <DropdownMenuLabel>Number of Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
              <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks
                .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
                .map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white hover:bg-gray-100 shadow-lg p-4"
                      >
                        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                        <p className="text-sm text-gray-600 mb-4">{formatDate(task.dueDate)}</p>
                        <div className="flex justify-between items-center">
                          {renderBadge(task.status)}
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => router.push(`/edit/${task.id}`)} className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md">Edit</Button>
                            <Button size="sm" onClick={() => openDeleteDialog(task.id)} className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md">Delete</Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteTask} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
