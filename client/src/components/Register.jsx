import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx'; // Use the custom hook
import { AlertCircle, UserPlus } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        disabled: 'bg-blue-300 text-white cursor-not-allowed',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (userData) => axios.post('/api/auth/register', userData),
    onSuccess: (response) => {
      const { token, user } = response.data;
      if (!token) throw new Error('No token received');
      login(token, user);
    },
    onError: (error) => console.error('Registration failed', error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      mutation.mutate({ error: new Error('Username and password are required') });
      return;
    }
    mutation.mutate({ username, password });
  };

  return (
    <div className="register p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      {mutation.isError && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {mutation.error.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className={cn(buttonVariants({ intent: mutation.isPending ? 'disabled' : 'primary' }))}
        >
          <UserPlus className="w-5 h-5" />
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;