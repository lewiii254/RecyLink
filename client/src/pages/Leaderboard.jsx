import { useEffect, useState } from "react";
import { rewardsAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await rewardsAPI.getLeaderboard(10);
      if (res.data.success) {
        setLeaders(res.data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to load leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="mt-2 text-gray-600">Top contributors by points</p>
        </div>

        <div className="card">
          <div className="space-y-2">
            {leaders.length === 0 && (
              <div className="text-center py-8 text-gray-600">No data yet</div>
            )}

            <ol className="divide-y divide-gray-100">
              {leaders.map((l) => (
                <li
                  key={l.id}
                  className={`py-3 sm:py-4 flex items-center justify-between ${
                    user && user.id === l.id
                      ? "bg-yellow-50 rounded-lg p-2"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {l.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {l.reportsCount} reports
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {l.points}
                      </p>
                      <p className="text-xs text-gray-500">#{l.rank}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
