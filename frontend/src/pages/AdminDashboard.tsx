import { useEffect, useState } from "react";
import axios from "axios";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: "OPEN" | "CLOSED";
  type: string;
};

export const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://backend.aayushkhanal810.workers.dev/api/v1/jobs?status=OPEN",
        { withCredentials: true }
      );
      setJobs(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">Company</th>
                  <th className="border border-gray-300 p-2">Location</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Type</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{job.title}</td>
                    <td className="border border-gray-300 p-2">
                      {job.company}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {job.location}
                    </td>
                    <td className="border border-gray-300 p-2">{job.status}</td>
                    <td className="border border-gray-300 p-2">{job.type}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        onClick={() =>
                          alert(`Edit job ${job.id} - feature coming soon`)
                        }>
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() =>
                          alert(`Delete job ${job.id} - feature coming soon`)
                        }>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};
