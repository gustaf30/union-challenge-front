import { useState, useEffect } from 'react';
import { getTasks, updateTask } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/router';

export default function EditTask() {
  const [task, setTask] = useState({ title: '', description: '', status: '0' });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (id) => {
    const data = await getTasks();
    const taskToEdit = data.find((t) => t.id === id);
    setTask(taskToEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTask(id, task);
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Editar Tarefa</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Título da Tarefa"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Descrição"
          />
        </div>
        <div className="mb-4">
          <Button
            value={task.status}
            onClick={(e) => setTask({ ...task, status: "0" })}>Pendente</Button>
          <Button
            value={task.status}
            onClick={(e) => setTask({ ...task, status: "1" })}>Em Progresso</Button>
          <Button
            value={task.status}
            onClick={(e) => setTask({ ...task, status: "2" })}>Completas</Button>
        </div>
        <Button type="submit">Salvar Alterações</Button>
      </form>
    </div>
  );
}