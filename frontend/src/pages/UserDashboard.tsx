import { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Briefcase } from "lucide-react";

const BACKEND_URL = "https://backend.aayushkhanal810.workers.dev";

const RANDOM_COMPANIES = [
  "TechCorp",
  "InnovateX",
  "Global Solutions",
  "NextGen Labs",
  "Creative Minds",
  "AlphaWorks",
  "Bright Future Inc",
];

export function UserDashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/v1/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
      } catch {
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/api/v1/applications`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert("✅ Application submitted!");
    } catch {
      alert("❌ Failed to apply.");
    }
  };

  const filteredJobs = jobs.filter((job: any) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCompanyName = (company: string | undefined, index: number) =>
    company || RANDOM_COMPANIES[index % RANDOM_COMPANIES.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-indigo-600 to-blue-300 py-16 px-4 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-blue-100 max-w-xl mx-auto">
          Browse through thousands of opportunities tailored to your skills &
          passion.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="flex items-center bg-white shadow-md rounded-xl p-2 border border-gray-200">
          <Search className="w-5 h-5 text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 outline-none bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white animate-pulse rounded-xl shadow-md"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-600 text-center">No matching jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job: any, idx: number) => (
              <div
                key={job.id}
                className="bg-white backdrop-blur-lg bg-opacity-90 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {job.title}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Briefcase size={16} /> {getCompanyName(job.company, idx)}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin size={16} /> {job.location || "Remote"}
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {job.description}
                </p>

                <button
                  onClick={() => handleApply(job.id)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transition">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
