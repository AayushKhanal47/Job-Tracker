import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const LandingNavbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-blue-400" />
          <Link
            to="/"
            className="text-3xl font-extrabold text-gray-900 tracking-tight">
            JobTracker
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-md text-2xl text-gray-600 hover:text-gray-900 transition duration-200">
            Home
          </Link>

          <Link
            to="/login"
            className="text-md px-5 py-3 rounded-md border border-blue-500 text-indigo-600 hover:bg-indigo-50 transition duration-200">
            Login
          </Link>

          <Link
            to="/signup"
            className="text-md px-5 py-3 rounded-md bg-blue-500 text-white hover:bg-indigo-700 transition duration-200">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
