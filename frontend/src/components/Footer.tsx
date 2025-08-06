const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t text-center p-4 text-sm text-gray-500 mt-10">
      <div className="max-w-7xl mx-auto">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-gray-700">JobTracker</span>. All rights reserved.
        </p>
        <p className="mt-1">
          Built with 💻 by <span className="text-blue-600 font-medium">Aayush</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
