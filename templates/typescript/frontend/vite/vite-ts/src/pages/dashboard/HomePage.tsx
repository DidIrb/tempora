import { useAuth } from '@context';

export const HomePage = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {user?.name} 👋
      </h2>
      <p className="text-gray-500 text-sm">Here's what's happening today.</p>
    </div>
  );
};
