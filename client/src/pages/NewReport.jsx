import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { reportsAPI } from "../utils/api";
import { MapPin, Camera, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const NewReport = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      lat: "",
      lng: "",
    },
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.location.lat) {
      newErrors.lat = "Latitude is required";
    } else if (
      isNaN(formData.location.lat) ||
      formData.location.lat < -90 ||
      formData.location.lat > 90
    ) {
      newErrors.lat = "Latitude must be a number between -90 and 90";
    }

    if (!formData.location.lng) {
      newErrors.lng = "Longitude is required";
    } else if (
      isNaN(formData.location.lng) ||
      formData.location.lng < -180 ||
      formData.location.lng > 180
    ) {
      newErrors.lng = "Longitude must be a number between -180 and 180";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const reportData = {
        ...formData,
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng),
        },
      };

      const response = await reportsAPI.create(reportData);

      if (response.data.success) {
        toast.success(
          `Report created successfully! You earned ${response.data.pointsAwarded} points.`
        );
        // Refresh user data to update points
        await refreshUser();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Show specific validation errors
        const validationErrors = error.response.data.errors;
        validationErrors.forEach((err) => {
          toast.error(`${err.param || "Field"}: ${err.msg}`);
        });
      } else {
        const message =
          error.response?.data?.message || "Failed to create report";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
            },
          }));
          toast.success("Location detected!");
        },
        (error) => {
          toast.error(
            "Unable to get your location. Please enter coordinates manually."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Report Waste Issue
          </h1>
          <p className="mt-2 text-gray-600">
            Help make your community cleaner by reporting waste problems.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${errors.title ? "input-error" : ""}`}
                placeholder="Brief description of the waste issue"
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input ${errors.description ? "input-error" : ""}`}
                placeholder="Provide detailed information about the waste issue, including type of waste, quantity, and any other relevant details"
                maxLength={500}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lat"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="lat"
                    name="lat"
                    value={formData.location.lat}
                    onChange={handleChange}
                    className={`input ${errors.lat ? "input-error" : ""}`}
                    placeholder="e.g., 40.7128"
                  />
                  {errors.lat && (
                    <p className="mt-1 text-sm text-red-600">{errors.lat}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lng"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="lng"
                    name="lng"
                    value={formData.location.lng}
                    onChange={handleChange}
                    className={`input ${errors.lng ? "input-error" : ""}`}
                    placeholder="e.g., -74.0060"
                  />
                  {errors.lng && (
                    <p className="mt-1 text-sm text-red-600">{errors.lng}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Use current location
              </button>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Image URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`input pr-10 ${
                    errors.imageUrl ? "input-error" : ""
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                <Camera className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                For demo purposes, you can use:
                https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500
              </p>
            </div>

            {/* Preview */}
            {formData.imageUrl && isValidUrl(formData.imageUrl) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={formData.imageUrl}
                    alt="Report preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <p>Unable to load image</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Points Info */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-bold">25</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">
                    You'll earn 25 points for submitting this report
                  </p>
                  <p className="text-xs text-primary-700">
                    Additional points available for verification and collection
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Report...
                  </div>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
