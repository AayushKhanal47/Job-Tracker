import { useEffect, useState } from "react";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
}

export function UserDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in. Please log in to view jobs.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://backend.aayushkhanal810.workers.dev/api/v1/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Backend response:", res.data);

        // Flexible handling of different backend shapes
        let jobsData: Job[] = [];
        if (Array.isArray(res.data)) {
          jobsData = res.data;
        } else if (Array.isArray(res.data.jobs)) {
          jobsData = res.data.jobs;
        } else if (res.data?.data && Array.isArray(res.data.data.jobs)) {
          jobsData = res.data.data.jobs;
        } else {
          console.warn("Unexpected jobs format:", res.data);
        }

        setJobs(jobsData);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        const errMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch jobs.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>User Dashboard</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id || job.title}>
              <strong>{job.title}</strong> — {job.company} ({job.location})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
