import Badges from '../components/Badges';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-gray-600">Overview of your badges and recent activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Badges</h2>
            <Badges points={user?.points || 0} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
