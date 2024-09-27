import { useState, useEffect } from 'react';
import { getTask, updateTask } from '../../services/api';
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
    const taskToEdit = await getTask(id);
    setTask(taskToEdit);
    console.log(taskToEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTask(id, task);
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <a href={window.location.href.split('/edit')[0]}>
            To do List
          </a>
        </h1>
      </header>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl mb-4 font-bold">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              value={task.title ?? ' '}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-1/3 border hover:border-gray-500"
              placeholder="Task Title"
              required
            />
        </div>
        <div className="mb-4">
          <Input
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-1/3 border hover:border-gray-500"
            placeholder="Description"
          />
        </div>
          <div className="mb-4">
            <Button
              value={task.status}
              onClick={(e) => setTask({ ...task, status: "0" })}>Pending</Button>
            <Button
              value={task.status}
              onClick={(e) => setTask({ ...task, status: "1" })}>In progress</Button>
            <Button
              value={task.status}
              onClick={(e) => setTask({ ...task, status: "2" })}>Completed</Button>
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </div>
    </div>
  );
}