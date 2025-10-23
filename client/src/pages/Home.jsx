import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Users, Award, Shield } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: 'Report Waste Issues',
      description: 'Easily report waste problems in your community with photos and location data.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Community Verification',
      description: 'Help verify reports from other users to ensure accuracy and build trust.'
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Earn Rewards',
      description: 'Get points for reporting, verifying, and contributing to a cleaner environment.'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Track Progress',
      description: 'Monitor the status of your reports and see the impact you\'re making.'
    }
  ]

  const stats = [
    { label: 'Reports Submitted', value: '1,234' },
    { label: 'Issues Resolved', value: '856' },
    { label: 'Community Members', value: '2,847' },
    { label: 'Points Awarded', value: '45,678' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Clean Communities,
              <br />
              <span className="text-primary-200">Better Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join RecyLink to report waste issues, earn rewards, and make your community cleaner and more sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/reports"
                    className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
                  >
                    View Reports
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How RecyLink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, community-driven approach to waste management and environmental improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of community members who are already making their neighborhoods cleaner and more sustainable.
          </p>
          {!user && (
            <Link
              to="/auth"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Join RecyLink Today
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
