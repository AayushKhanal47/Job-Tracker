import { Briefcase, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-500" />
          <span className="text-sm font-semibold">JobTracker</span>
        </div>

        <div className="flex gap-4 text-gray-400">
          <a
            href="https://github.com/AayushKhanal47"
            target="_blank"
            rel="noopener noreferrer">
            <Github className="w-5 h-5 hover:text-white" />
          </a>
          <a
            href="https://www.linkedin.com/in/aayush-khanal-b1ab64290/"
            target="_blank"
            rel="noopener noreferrer">
            <Linkedin className="w-5 h-5 hover:text-white" />
          </a>
          <a
            href="https://x.com/AayushKhanal20"
            target="_blank"
            rel="noopener noreferrer">
            <Twitter className="w-5 h-5 hover:text-white" />
          </a>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        Made with ❤️ by JobTracker
      </div>
    </footer>
  );
};

export default Footer;
