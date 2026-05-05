import { useEffect, useState } from "react";
import { PollsAPI } from "../../api/pollsApi";
import { useNavigate } from "react-router-dom";

import PollCard from "../../components/polls/PollCard";
import { getPollStatus } from "../../utils/pollStatus";
import { VotesAPI } from "../../api/votesApi";

const TABS = ["ACTIVE", "UPCOMING", "ENDED"];

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [tab, setTab] = useState("ACTIVE");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ FIXED (inside component)

  // 🔥 Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await PollsAPI.getAll();
        const data = res?.data?.data || [];

        setPolls(data);
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

  // 🧠 CLICK HANDLER (IMPORTANT FIX)
  const handlePollClick = async (pollId) => {
    try {
      const res = await VotesAPI.getStatus(pollId);

      if (res.data.hasVoted) {
        navigate(`/polls/${pollId}/voted`);
      } else {
        navigate(`/polls/${pollId}`);
      }
    } catch (err) {
      navigate(`/polls/${pollId}`); // fallback
    }
  };

  // 🔍 Filter polls by tab
  const filteredPolls = polls.filter((p) => {
    const status = getPollStatus(p?.startsAt, p?.endsAt);
    return status === tab;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Polls
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {filteredPolls.length > 0 ? (
              filteredPolls.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handlePollClick(p._id)} // ✅ IMPORTANT FIX
                  className="cursor-pointer"
                >
                  <PollCard poll={p} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-2 text-center">
                No {tab.toLowerCase()} polls.
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
}