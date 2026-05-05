import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import ProgressBar from "../../components/results/ProgressBar";

import { PollsAPI } from "../../api/pollsApi";

export default function AdminResults() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Fetch poll results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await PollsAPI.getById(id);

        const data = res?.data?.data;
        setPoll(data || null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load results"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-6 text-gray-500">Loading results...</p>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-6 text-red-500">{error}</p>
      </div>
    );
  }

  // ❌ No data
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-6 text-gray-500">No results found</p>
      </div>
    );
  }

  const totalVotes = poll?.totalVotes || 1;

  const maxVotes = Math.max(
    ...(poll?.options?.map((o) => o.count) || [0])
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* <Navbar /> */}

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {poll?.title}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Admin View • Total Votes: {poll?.totalVotes || 0}
        </p>

        {/* Results */}
        <div className="flex flex-col gap-3">

          {poll?.options?.map((opt) => (
            <ProgressBar
              key={opt._id}
              label={opt.name}
              count={opt.count}
              percent={Math.round((opt.count / totalVotes) * 100)}
              isWinner={opt.count === maxVotes && maxVotes > 0}
            />
          ))}

        </div>

      </div>
    </div>
  );
}