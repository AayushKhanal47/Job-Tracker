import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://backend.aayushkhanal810.workers.dev/api/v1";

export function AdminApplications({ jobId }: { jobId: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          `${BACKEND_URL}/admin/applications/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);
  const updateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("jwt");

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
      console.error("Failed to update status: ", err);
      alert("Error updating application status");
    }
  };

  return (
    <div>
      <h1>Admin Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <div
              key={app.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 p-5 rounded-xl shadow-lg">
              <p className="font-semibold text-gray-800">
                <span className="font-normal text-gray-500">Job: </span>
                {app.job?.title}
              </p>
              <p className="font-semibold text-gray-800">
                <span className="font-normal text-gray-500">User: </span>
                {app.user?.email}
              </p>
              <p className="font-semibold text-gray-800">
                <span className="font-normal text-gray-500">Status: </span>
                {app.status}
              </p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => updateStatus(app.id, "ACCEPTED")}>
                  Accept
                </button>
                <button onClick={() => updateStatus(app.id, "REJECTED")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
