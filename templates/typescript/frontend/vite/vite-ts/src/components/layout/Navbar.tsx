import { useAuth } from '@context';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="w-64 px-4 py-1.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Avatar + user info + logout */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
