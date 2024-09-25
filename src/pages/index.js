import { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/api';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    const data = await getTasks(filter);
    setTasks(data);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Lista de Tarefas</h1>

      <div className="mb-4">
        <Button onClick={() => setFilter('')}>Todas</Button>
        <Button onClick={() => setFilter('0')}>Pendentes</Button>
        <Button onClick={() => setFilter('1')}>Em Progresso</Button>
        <Button onClick={() => setFilter('2')}>Completas</Button>
      </div>

      <Link href="/new">
        <Button className="mb-4">Nova Tarefa</Button>
      </Link>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex justify-between items-center">
            <div>
              <h2 className="text-lg">{task.title}</h2>
              <p>{task.description}</p>
              <span>Status: {task.status}</span>
            </div>
            <div>
              <Link href={`/edit/${task.id}`}>
                <Button>Editar</Button>
              </Link>
              <Button onClick={() => handleDelete(task.id)} className="ml-2">Excluir</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
