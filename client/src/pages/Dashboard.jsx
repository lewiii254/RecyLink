import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { reportsAPI } from "../utils/api";
import {
  MapPin,
  Plus,
  Eye,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import SuiConnect from "../components/SuiConnect";
import { rewardsAPI } from "../utils/api";
import Badges from "../components/Badges";
import ActivityFeed from "../components/ActivityFeed";

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    collectedReports: 0,
    pendingReports: 0,
  });
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchLeaders();
  }, []);

  const fetchLeaders = async (limit = 3) => {
    setLeadersLoading(true);
    try {
      const res = await rewardsAPI.getLeaderboard(limit);
      if (res.data.success) {
        setLeaders(res.data.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLeadersLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      if (response.data.success) {
        const userReports = response.data.reports;
        setReports(userReports.slice(0, 5)); // Show only recent 5 reports

        // Calculate stats
        const total = userReports.length;
        const verified = userReports.filter(
          (r) => r.status === "Verified"
        ).length;
        const collected = userReports.filter(
          (r) => r.status === "Collected"
        ).length;
        const pending = userReports.filter(
          (r) => r.status === "Reported"
        ).length;

        setStats({
          totalReports: total,
          verifiedReports: verified,
          collectedReports: collected,
          pendingReports: pending,
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Reported":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Verified":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "Collected":
        return <Award className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reported":
        return "status-reported";
      case "Verified":
        return "status-verified";
      case "Collected":
        return "status-collected";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your activity and impact on the community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.points}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReports}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.collectedReports}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReports}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Reports
                </h2>
                <Link
                  to="/reports"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all
                </Link>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reports yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by reporting a waste issue in your community.
                  </p>
                  <Link to="/reports/new" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Report
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {report.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              {report.verificationCount} verifications
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span
                            className={`status-badge ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </span>
                          <Link
                            to={`/reports/${report._id}`}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Create New Report */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/reports/new"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Link>
                <Link
                  to="/reports"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Reports
                </Link>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Points Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Report Submission
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    +25 pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Report Verification
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    +50 pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Waste Collection
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    +100 pts
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      Total Points
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {user.points}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="card">
              <Badges points={user.points} />
            </div>

            {/* Recent Activity */}
            <div className="card">
              <ActivityFeed />
            </div>

            {/* Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Verify other reports to earn points and help the community
                  </span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Include clear photos and accurate location data</span>
                </div>
                <div className="flex items-start">
                  <Award className="w-4 h-4 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Track your impact and earn rewards for your contributions
                  </span>
                </div>
              </div>
            </div>

            {/* Top Contributors (small leaderboard widget) */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Contributors
              </h3>
              {leadersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : leaders.length === 0 ? (
                <div className="text-sm text-gray-600">No contributors yet</div>
              ) : (
                <ol className="space-y-3">
                  {leaders.map((l) => (
                    <li
                      key={l.id}
                      className={`flex items-center justify-between ${
                        l.id === user.id ? "bg-yellow-50 rounded-md p-2" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {l.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {l.reportsCount} reports
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {l.points}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Sui Demo */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sui Demo
              </h3>
              <div className="text-sm text-gray-600 mb-3">
                Connect a Sui wallet (demo) to see how RecyLink can link public
                wallet addresses, mint proof-of-participation badges, and record
                small on-chain receipts for transparency.
              </div>
              <SuiConnect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
