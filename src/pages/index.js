import { useEffect, useState } from 'react';
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Input } from "../components/ui/input"
import { getTasks, deleteTask, searchTasksByTitle } from '../services/api';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState('1');
  const [limit, setLimit] = useState('5');
  const [totalTasks, setTotalTasks] = useState('');
  const [totalPages, setTotalPages] = useState('')
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
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
    countTasks();
  },);

  useEffect(() => {
    if (totalTasks && limit) {
      const total = Math.ceil(totalTasks / parseInt(limit));
      setTotalPages(total);
    }
  }, [totalTasks, limit]);

  useEffect(() => {
    if (search) {
      fetchTasksByTitle();
    } else {
      fetchTasks(); 
    }
  }, [filter, page, limit, search]);

  const countTasks = async () => {
    try {
      const allData = await getTasks();
      setTotalTasks(allData.length);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchTasks = async () => {
    router.push(`?page=${page}&limit=${limit}`);
    try {
      const data = await getTasks(filter, page, limit);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasksByTitle = async () => {
    if (!search) return; 
    try {
      const data = await searchTasksByTitle(search); 
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasksOverdue = async () => {
    try {
      const data = await getTasks(null, null, null, { overdue: true });
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const nextPage = async () => {
    setPage(parseInt(page) + 1)
    router.push(`?page=${page}`);
    try {
      const data = await getTasks(filter, page, limit);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const prevPage = async () => {
    setPage(parseInt(page) - 1)
    if (page > 1) {
      router.push(`?page=${page}`);
    }
    try {
      const data = await getTasks(filter, page, limit);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete);
      setDeleteDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (id) => {
    router.push(`/edit/${id}`);
  };

  const renderBadge = (status) => {
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);

    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(tasks); 
    const [removed] = reorderedTasks.splice(source.index, 1); 
    reorderedTasks.splice(destination.index, 0, removed); 

    setTasks(reorderedTasks); 
  };

  const openDeleteDialog = (taskId) => {
    setTaskToDelete(taskId); 
    setDeleteDialogOpen(true); 
  };

  return (
    <div className={`flex flex-col min-h-screen w-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <a href='./'>
            To do List
          </a>
        </h1>
        <div className="flex space-x-4">
          <Button onClick={() => router.push('/new')} className={`${darkMode ? 'bg-blue-950 text-white hover:bg-blue-900' : 'bg-blue-500 text-white hover:bg-blue-600'} px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}>
            New Task
          </Button>
          <Button onClick={ toggleDarkMode } className={`${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'} transition-colors duration-200 ease-in-out`}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </header>
      
      <div className="mb-6 flex justify-start flex-wrap">
        
        <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'}  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`} onClick={() => setFilter('')}>All</Button>
        <div className='mr-2'></div>
        <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'}  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`} onClick={() => setFilter('0')}>Pending</Button>
        <div className='mr-2'></div>
        <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'}  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`} onClick={() => setFilter('1')}>In Progress</Button>
        <div className='mr-2'></div>
        <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'}  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`} onClick={() => setFilter('2')}>Completed</Button>
        <div className='mr-2'></div>
        <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'}  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`} onClick={{fetchTasksOverdue}}>Overdue</Button>
        <div className='mr-2'></div>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${darkMode ? 'border-blue-900 hover:border-blue-800 text-white' : 'hover:border-gray-500'} w-1/4 border transition-colors duration-200 ease-in-out rounded-md`}
        />
        <div className='mr-2'></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'} px-4 py-2 ml-2 rounded-md`}>
              Show
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`${darkMode ? 'bg-blue-950 text-white' : 'bg-white'} px-4 py-2 ml-2 rounded-md`}>
            <DropdownMenuLabel >Number of Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={limit} onValueChange={(value) => {
              setLimit(value);
            }}>
              <DropdownMenuRadioItem value="5" className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'} transition-colors duration-200 ease-in-out w-56 rounded-md`}>
                5
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10" className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'} transition-colors duration-200 ease-in-out w-56 rounded-md`}>
                10
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="20" className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-white hover:bg-gray-100'} transition-colors duration-200 ease-in-out w-56 rounded-md`}>
                20
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                        className={`${darkMode ? 'bg-gray-950 hover:bg-gray-900' : 'bg-white hover:bg-gray-100'} transition-colors duration-300 ease-in-out shadow-lg p-4`}
                      >
                        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                          {renderBadge(task.status)}
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleEditTask(task.id)} className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openDeleteDialog(task.id)}
                              className={`${darkMode ? 'bg-red-900 text-white hover:bg-red-800' : 'bg-red-500 text-white hover:bg-red-600'} px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
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
        <DialogContent className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <DialogHeader>
            <DialogTitle>Confirm exclusion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeleteTask} className={`${darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-auto flex justify-center items-center py-5">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          Previous
        </button>
        
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className={`${darkMode ? 'bg-blue-950 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
        >
          Next
        </button>
      </div>
    </div>
  );
}