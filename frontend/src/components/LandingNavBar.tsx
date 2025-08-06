import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight"
        >
          🚀 JobTracker
        </Link>

        {/* Desktop Navigation */}
        <div className="flex space-x-10 items-center">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 text-lg font-medium transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
