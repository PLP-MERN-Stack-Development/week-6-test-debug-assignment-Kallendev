import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Bug Tracker</h1>
      <p className="mb-6 text-gray-700">Please login or register to continue</p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
}
