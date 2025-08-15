import { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Briefcase } from "lucide-react";

const BACKEND_URL = "https://backend.aayushkhanal810.workers.dev";

export function UserDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${BACKEND_URL}/api/v1/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.jobs || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch jobs. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/applications/${jobId}`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`✅ ${res.data.message}`);
    } catch (err: any) {
      console.error(err.response || err);
      alert("❌ Something went wrong.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700">
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Discover Available Jobs
        </h1>
        <p className="text-lg text-blue-100 max-w-xl mx-auto">
          Apply to exciting openings that match your passion and skills
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12 px-4">
        <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-200">
          <Search className="w-5 h-5 text-gray-500 ml-1" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none pl-2 text-gray-700"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white/70 animate-pulse rounded-xl shadow-md"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-200 text-center">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-white text-center">No matching jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {job.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Briefcase size={15} /> {job.company || "Company Name"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin size={15} /> {job.location || "Remote"}
                </div>
                <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                  {job.description}
                </p>
                <button
                  onClick={() => handleApply(job.id)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition">
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
