import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://backend.aayushkhanal810.workers.dev/api/v1";

export function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${BACKEND_URL}/admin/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h1>Admin Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(applications, null, 2)}</pre>
      )}
    </div>
  );
}
