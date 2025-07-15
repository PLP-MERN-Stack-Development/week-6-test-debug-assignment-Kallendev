import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BugForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (bug) =>
      axios.post('/api/bugs', bug, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bugs']);
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Bug title"
        required
        className="border p-2 w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Bug description"
        required
        className="border p-2 w-full"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {mutation.isPending ? 'Submitting...' : 'Submit Bug'}
      </button>
    </form>
  );
};

export default BugForm;
