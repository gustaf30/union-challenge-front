import { useState } from 'react';
import { createTask } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useRouter } from 'next/router';

export default function NewTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ title, description });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (Optional)"
          />
        </div>
        <Button type="submit">Create Task</Button>
      </form>
    </div>
  );
}
