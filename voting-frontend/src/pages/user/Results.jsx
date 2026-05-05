import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPollResults } from "../../api/resultsApi";
import ProgressBar from "../../components/results/ProgressBar";

export default function Results() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getPollResults(id);
        setData(res?.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load results"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  // 🚨 Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 🚨 No data state
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  const options = data.options || [];
  const totalVotes = data.totalVotes || 0;

  // 🔥 Find max votes (handles ties)
  const maxVotes = Math.max(...options.map((o) => o.count || 0));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-1 text-gray-800">
          {data.title}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Total votes: {totalVotes}
        </p>

        {/* Results */}
        <div className="flex flex-col gap-3">
          {options.length > 0 ? (
            options.map((opt) => {
              const count = opt.count || 0;

              return (
                <ProgressBar
                  key={opt._id}
                  label={opt.name}
                  count={count}
                  percent={
                    totalVotes > 0
                      ? Math.round((count / totalVotes) * 100)
                      : 0
                  }
                  isWinner={count === maxVotes && maxVotes > 0}
                />
              );
            })
          ) : (
            <p className="text-gray-400 text-center">
              No results available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}