import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90 transition">
           JobTracker
        </Link>
        <nav className="space-x-6 text-sm font-medium">
          <Link to="/login" className="hover:underline hover:text-gray-200">
            Login
          </Link>
          <Link to="/signup" className="hover:underline hover:text-gray-200">
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
