import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { reportsAPI } from "../utils/api";
import {
  MapPin,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  Award,
  Filter,
  Search,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Reports = () => {
  const { user, isAdmin, refreshUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [collecting, setCollecting] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    setVerifying(reportId);
    try {
      const response = await reportsAPI.verify(reportId);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchReports(); // Refresh the list
        // Refresh user data to update points if they were awarded
        await refreshUser();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to verify report";
      toast.error(message);
    } finally {
      setVerifying(null);
    }
  };

  const handleCollect = async (reportId) => {
    if (!isAdmin) return;
    if (
      !window.confirm(
        "Mark this report as collected? This will award points to the reporter."
      )
    )
      return;
    setCollecting(reportId);
    try {
      const response = await reportsAPI.collect(reportId);
      if (response.data.success) {
        toast.success(response.data.message || "Report marked as collected");
        fetchReports();
        // Refresh user data in case points were updated for the reporter
        await refreshUser();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to mark collected";
      toast.error(message);
    } finally {
      setCollecting(null);
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

  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      filters.status === "all" || report.status === filters.status;
    const matchesSearch =
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const canVerify = (report) => {
    if (report.reporter._id === user._id) return false; // Can't verify own report
    if (report.verifiedBy.some((v) => v._id === user._id)) return false; // Already verified
    return true;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? "All Reports" : "My Reports"}
              </h1>
              <p className="mt-2 text-gray-600">
                {isAdmin
                  ? "Manage and monitor all community reports"
                  : "Track the status of your waste reports"}
              </p>
            </div>
            <Link to="/reports/new" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="input"
              >
                <option value="all">All Status</option>
                <option value="Reported">Reported</option>
                <option value="Verified">Verified</option>
                <option value="Collected">Collected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="card text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status !== "all"
                ? "No reports found"
                : "No reports yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by reporting a waste issue in your community"}
            </p>
            {!filters.search && filters.status === "all" && (
              <Link to="/reports/new" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Report
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report._id} className="card">
                {/* Image */}
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-100 items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {report.title}
                    </h3>
                    <span
                      className={`status-badge ${getStatusColor(
                        report.status
                      )} ml-2 flex-shrink-0`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {report.reporter.username}</span>
                    <span>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>{report.verificationCount}/3 verifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/reports/${report._id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {canVerify(report) && (
                        <button
                          onClick={() => handleVerify(report._id)}
                          disabled={verifying === report._id}
                          className="p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                          title="Verify this report"
                        >
                          {verifying === report._id ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {/* Admin: Collect action */}
                      {isAdmin && report.status !== "Collected" && (
                        <button
                          onClick={() => handleCollect(report._id)}
                          disabled={collecting === report._id}
                          className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                          title="Mark as collected"
                        >
                          {collecting === report._id ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Award className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {reports.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {reports.filter((r) => r.status === "Reported").length}
              </div>
              <div className="text-sm text-gray-600">Pending Reports</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {reports.filter((r) => r.status === "Verified").length}
              </div>
              <div className="text-sm text-gray-600">Verified Reports</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {reports.filter((r) => r.status === "Collected").length}
              </div>
              <div className="text-sm text-gray-600">Collected Reports</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
