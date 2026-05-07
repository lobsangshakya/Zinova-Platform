import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "https://zinova-backend.onrender.com";

interface Contribution {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  source: string;
  status: string;
}

interface ContributionsResponse {
  email: string;
  total: number;
  contributions: Contribution[];
}

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedEmail = localStorage.getItem("userEmail");
    if (!token || !storedEmail) {
      navigate("/login", { replace: true });
      return;
    }
    setEmail(storedEmail);

    fetch(`${API}/api/contributions?email=${encodeURIComponent(storedEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load contributions");
        return res.json();
      })
      .then((json: ContributionsResponse) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  }

  const lastActivity = data?.contributions[0]?.timestamp ?? null;
  const orgs = data
    ? [...new Set(data.contributions.map((c) => c.organization).filter(Boolean))]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Total Contributions
            </p>
            <p className="text-4xl font-bold text-green-600">
              {loading ? "—" : (data?.total ?? 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">form submissions to NGOs</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Last Activity
            </p>
            <p className="text-sm font-semibold text-blue-600 mt-2">
              {loading ? "—" : lastActivity ? formatDate(lastActivity) : "No activity yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">most recent submission</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Organizations
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {loading ? "—" : orgs.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">unique orgs reached</p>
          </div>
        </div>

        {/* Contribution history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Contribution History</h2>
          </div>

          {loading && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Loading your contributions...
            </div>
          )}

          {error && (
            <div className="px-6 py-8 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && data?.contributions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-sm">No contributions yet.</p>
              <p className="text-gray-400 text-xs mt-1">
                Submit a form on the landing page to get started.
              </p>
            </div>
          )}

          {!loading && !error && data && data.contributions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Organization</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Source</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.contributions.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(c.timestamp)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{c.name || "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{c.organization || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                          {c.source || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                          {c.status || "new"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
