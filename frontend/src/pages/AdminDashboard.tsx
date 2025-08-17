import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const BACKEND_URL = "https://backend.aayushkhanal810.workers.dev/api/v1";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary?: number;
  status: "OPEN" | "CLOSED";
};

type Application = {
  id: string;
  status: string;
  user: { email: string };
  job: { title: string };
};

type DashboardStats = {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
};

export function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "ENGINEERING",
    salary: 0,
  });

  const token = localStorage.getItem("jwt");

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/jobs`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          salary: Number(form.salary),
          type: form.type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Job created");
      setForm({
        title: "",
        description: "",
        location: "",
        type: "ENGINEERING",
        salary: 0,
      });
      fetchJobs();
      fetchDashboard();
    } catch (err) {
      alert("Error creating job");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Delete this job?")) return;
    await axios.delete(`${BACKEND_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
    fetchDashboard();
  };

  const handleStatusChange = async (
    jobId: string,
    status: "OPEN" | "CLOSED"
  ) => {
    await axios.patch(
      `${BACKEND_URL}/admin/jobs/${jobId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchJobs();
    fetchDashboard();
  };

  const handleViewApplications = async (jobId: string) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/admin/applications/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Applications response => ", res.data);
      setApplications(res.data.applications || []);
      setSelectedJobId(jobId);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handleApplicationStatus = async (
    applicationId: string,
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/admin/applications/${applicationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update application", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Admin Dashboard
      </h1>

      {stats && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <p className="text-3xl font-black text-blue-700">
              {stats.totalJobs}
            </p>
            <p className="mt-1 text-blue-800">Total Jobs</p>
          </div>
          <div className="bg-purple-50 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <p className="text-3xl font-black text-purple-700">
              {stats.totalUsers}
            </p>
            <p className="mt-1 text-purple-800">Total Users</p>
          </div>
          <div className="bg-indigo-50 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <p className="text-3xl font-black text-indigo-700">
              {stats.totalApplications}
            </p>
            <p className="mt-1 text-indigo-800">Applications</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl space-y-5 mb-12">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Create a Job
        </h2>
        <form onSubmit={handleCreateJob} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg">
            <option value="ENGINEERING">Engineering</option>
            <option value="MARKETING">Marketing</option>
            <option value="SALES">Sales</option>
            <option value="DESIGN">Design</option>
            <option value="HR">HR</option>
            <option value="FINANCE">Finance</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Existing Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-1 text-gray-800">
                {job.title}
              </h3>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-700 text-sm my-2">{job.description}</p>
              <button
                onClick={() => handleViewApplications(job.id)}
                className="text-blue-600 underline text-sm mb-2">
                View Applications
              </button>
              <div className="flex gap-3 items-center mt-3">
                <select
                  value={job.status}
                  onChange={(e) =>
                    handleStatusChange(
                      job.id,
                      e.target.value as "OPEN" | "CLOSED"
                    )
                  }
                  className="flex-1 p-2 border rounded-lg bg-white">
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJobId && (
        <div className="mt-10 bg-white p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            Applications for Job ID: {selectedJobId}
          </h3>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="border p-4 rounded-lg mb-3 bg-gray-50">
                <p>
                  <strong>User:</strong> {app.user?.email}
                </p>
                <p>
                  <strong>Status:</strong> {app.status}
                </p>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleApplicationStatus(app.id, "ACCEPTED")}
                    className="bg-green-500 text-white px-3 py-1 rounded">
                    Accept
                  </button>
                  <button
                    onClick={() => handleApplicationStatus(app.id, "REJECTED")}
                    className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
