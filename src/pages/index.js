import { useEffect, useState } from 'react';
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import { getTasks, deleteTask } from '../services/api';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ApiError } from 'next/dist/server/api-utils';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState('1');
  const [limit, setLimit] = useState('3');
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
    fetchTasks();
  }, [filter, page, limit]);

  const fetchTasks = async () => {
    router.push(`?page=${page}`);
    try {
      const data = await getTasks(filter, page, limit);
      setTasks(data);
      //setTotalPages( Math.ceil(data.size / parseInt(limit)) );
      setTotalPages(3);
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
        return <Badge color='yellow'>Pendente</Badge>;
      case '1':
        return <Badge color="blue">Em Progresso</Badge>;
      case '2':
        return <Badge color="green">Concluída</Badge>;
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
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lista de Tarefas</h1>
        <div className="flex space-x-4">
          <Button onClick={() => router.push('/new')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Nova Tarefa
          </Button>
          <Button onClick={toggleDarkMode} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            {darkMode ? 'Modo Claro' : 'Modo Escuro'}
          </Button>
        </div>
      </header>

      <div className="mb-6 flex justify-between">
        
        <Button onClick={() => setFilter('')}>Todas</Button>
        <Button onClick={() => setFilter('0')}>Pendentes</Button>
        <Button onClick={() => setFilter('1')}>Em Progresso</Button>
        <Button onClick={() => setFilter('2')}>Completas</Button>
        
        
        <Input
          placeholder="Pesquisar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks
                .filter(task => task.title.toLowerCase().includes(search.toLowerCase())) // Filtra pela pesquisa
                .map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="shadow-lg p-4"
                      >
                        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                          {renderBadge(task.status)}
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleEditTask(task.id)} className="bg-blue-500 text-white">
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openDeleteDialog(task.id)}
                              className="bg-red-500 text-white"
                            >
                              Excluir
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
        <DialogContent style={{ backgroundColor: '#f0f0f0' }}>
          <DialogHeader>
            <DialogTitle>Confirm exclusion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button className="bg-blue-500 text-white" >Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeleteTask} className="bg-red-500 text-white">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center items-center py-5">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`px-4 py-2 mr-2 ${page === 1 ? 'bg-blue-600' : 'bg-blue-500 text-white'} rounded-md`}
        >
          Previous
        </button>
        
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className={`px-4 py-2 ml-2 ${page === totalPages ? 'bg-blue-600' : 'bg-blue-500 text-white'} rounded-md`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
