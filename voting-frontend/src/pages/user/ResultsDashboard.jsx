import { useEffect, useState } from "react";
import { PollsAPI } from "../../api/pollsApi";
import PollChart from "../../components/charts/PollChart";

export default function ResultsDashboard() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await PollsAPI.getUserResults(); // ✅ FIXED
        setPolls(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch results", err);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Your Voting Results
      </h1>

      {polls.length === 0 ? (
        <p className="text-gray-400">No results available</p>
      ) : (
        polls.map((poll) => {
          const chartData = (poll.options || []).map((opt) => ({
            name: opt.text,
            votes: opt.votes,
          }));

          return (
            <div
              key={poll._id}
              className="bg-white p-6 rounded-xl shadow mb-6"
            >
              <h2 className="text-lg font-semibold mb-4">
                {poll.title}
              </h2>

              {chartData.length > 0 ? (
                <PollChart data={chartData} />
              ) : (
                <p className="text-gray-400 text-sm">
                  No votes yet
                </p>
              )}

              <p className="text-sm text-gray-500 mt-3">
                Total votes: {poll.totalVotes || 0}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}