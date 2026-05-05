import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Trash2, Plus } from "lucide-react";

import { PollsAPI } from "../../api/pollsApi";
import { getPollStatus } from "../../utils/pollStatus";

export default function ManagePolls() {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await PollsAPI.getAll();
        const data = res?.data?.data;

        const list = Array.isArray(data) ? data : [];
        setPolls(list);
        setFilteredPolls(list);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load polls"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const filtered = polls.filter((poll) =>
      poll.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPolls(filtered);
  }, [search, polls]);

  const pillColor = {
    ACTIVE: "bg-green-100 text-green-700",
    UPCOMING: "bg-amber-100 text-amber-700",
    ENDED: "bg-gray-200 text-gray-600",
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-6xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs tracking-widest text-gray-400 mb-2">
              ADMINISTRATION · POLLS
            </p>

            <h1 className="text-4xl font-serif font-normal text-gray-900">
              Manage all ballots.
            </h1>
          </div>

          <Link
            to="/admin/polls/new"
            className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 transition"
          >
            <Plus size={16} /> New poll
          </Link>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white border rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-md bg-gray-50 px-3 py-2 rounded-md border">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search polls..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-400">
            {filteredPolls.length} polls
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white border rounded-lg overflow-hidden">

          {loading ? (
            <p className="p-6 text-gray-500">Loading polls...</p>
          ) : filteredPolls.length === 0 ? (
            <p className="p-6 text-gray-400 text-center">
              No polls found
            </p>
          ) : (
            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">End</th>
                  <th className="px-4 py-3 text-left">Votes</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y">

                {filteredPolls.map((poll) => {
                  const status = getPollStatus(
                    poll?.startsAt,
                    poll?.endsAt
                  );

                  return (
                    <tr key={poll._id} className="hover:bg-gray-50">

                      {/* TITLE + SUBTEXT */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">
                          {poll.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {poll.organization || "—"}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${pillColor[status]}`}
                        >
                          ● {status}
                        </span>
                      </td>

                      {/* START */}
                      <td className="px-4 py-4 text-gray-700">
                        {formatDate(poll.startsAt)}
                      </td>

                      {/* END */}
                      <td className="px-4 py-4 text-gray-700">
                        {formatDate(poll.endsAt)}
                      </td>

                      {/* VOTES */}
                      <td className="px-4 py-4 text-gray-700">
                        {poll.totalVotes || 0}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-4 flex justify-end gap-4">

                        <Link
                          to={`/admin/polls/${poll._id}/results`}
                          className="flex items-center gap-1 text-gray-600 hover:text-black text-sm"
                        >
                          <Eye size={16} /> Results
                        </Link>

                        <button className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>

                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER NOTE */}
        <p className="text-sm text-gray-400 mt-4">
          Open the Results Dashboard for charts and CSV export
        </p>
      </div>
    </div>
  );
}