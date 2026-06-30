import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: '🏠 Home' },
  { to: '/dashboard/todos', label: '✅ Todos' },
];

export const Sidebar = () => (
  <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col py-8 px-4 gap-2">
    <h1 className="text-xl font-bold mb-6 px-2">MyApp</h1>
    {links.map((l) => (
      <NavLink
        key={l.to}
        to={l.to}
        end
        className={({ isActive }) =>
          `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`
        }
      >
        {l.label}
      </NavLink>
    ))}
  </aside>
);
