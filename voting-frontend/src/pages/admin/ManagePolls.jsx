import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PollsAPI } from "../../api/pollsApi";
import { getPollStatus } from "../../utils/pollStatus";
import Navbar from "../../components/common/Navbar";

export default function ManagePolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await PollsAPI.getAll();

        const data = res?.data?.data;

        setPolls(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load polls"
        );
        setPolls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const pillColor = {
    ACTIVE: "bg-green-100 text-green-700",
    UPCOMING: "bg-amber-100 text-amber-700",
    ENDED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Polls</h1>

          <Link
            to="/admin/polls/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + Create Poll
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-gray-500">Loading polls...</p>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">

            {/* Empty */}
            {polls.length === 0 ? (
              <p className="p-6 text-gray-400 text-center">
                No polls found
              </p>
            ) : (
              <table className="w-full text-sm">

                {/* Header */}
                <thead className="bg-gray-50 border-b text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Votes</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y">

                  {polls.map((poll) => {
                    const status = getPollStatus(
                      poll?.startsAt,
                      poll?.endsAt
                    );

                    return (
                      <tr key={poll?._id} className="hover:bg-gray-50">

                        {/* Title */}
                        <td className="px-4 py-3 font-medium">
                          {poll?.title}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              pillColor[status]
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Votes */}
                        <td className="px-4 py-3 text-gray-500">
                          {poll?.totalVotes || 0}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          {/* ✅ FIXED ROUTE */}
                          <Link
                            to={`/admin/polls/${poll?._id}/results`}
                            className="text-blue-600 text-xs hover:underline"
                          >
                            View Results
                          </Link>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            )}

          </div>
        )}
      </div>
    </div>
  );
}