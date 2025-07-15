import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBugs = async () => {
  const { data } = await axios.get('/api/bugs', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};

const BugList = () => {
  const { data: bugs, isLoading, error } = useQuery({
    queryKey: ['bugs'],
    queryFn: fetchBugs,
  });

  if (isLoading) return <p>Loading bugs...</p>;
  if (error) return <p className="text-red-500">Error loading bugs</p>;

  return (
    <div className="p-4 space-y-2">
      {bugs.map((bug) => (
        <div
          key={bug._id}
          className="border p-4 rounded shadow bg-white"
        >
          <h3 className="font-semibold">{bug.title}</h3>
          <p>{bug.description}</p>
          <p className="text-sm text-gray-500">Status: {bug.status}</p>
        </div>
      ))}
    </div>
  );
};

export default BugList;
