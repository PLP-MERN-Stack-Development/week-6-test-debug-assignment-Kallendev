import { useAuth } from '../context/AuthContext.jsx';
import BugForm from './BugForm.jsx';
import BugList from './BugList.jsx';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Welcome, {user?.username}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <BugForm />
      <BugList />
    </div>
  );
}

export default Dashboard;
