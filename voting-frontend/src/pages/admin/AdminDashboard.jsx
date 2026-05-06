import { useEffect, useState } from "react";
import { PollsAPI } from "../../api/pollsApi";
import PollChart from "../../components/charts/PollChart";

export default function AdminDashboard() {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await PollsAPI.getAllResults();
        const data = res?.data?.data || [];

        setPolls(data);
        setSelectedPoll(data[0]); // default select first poll
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  if (!selectedPoll) {
    return (
      <div className="p-10 text-gray-500">
        No data available
      </div>
    );
  }

  const chartData = selectedPoll.options.map((opt) => ({
    name: opt.text,
    votes: opt.votes,
  }));

  const totalVotes = selectedPoll.totalVotes || 0;

  const winner =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.votes > b.votes ? a : b))
      : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs tracking-widest text-gray-400">
            ADMINISTRATION · ANALYTICS
          </p>

          <h1 className="text-4xl font-serif text-[#080838]">
            Results dashboard.
          </h1>
        </div>

        {/* Dropdown */}
        <select
          className="border rounded-lg px-4 py-2 text-sm"
          onChange={(e) => {
            const poll = polls.find(p => p._id === e.target.value);
            setSelectedPoll(poll);
          }}
        >
          {polls.map((poll) => (
            <option key={poll._id} value={poll._id}>
              {poll.title}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* Total Votes */}
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-xs text-gray-400 tracking-widest">
            TOTAL VOTES
          </p>
          <h2 className="text-3xl font-semibold mt-2">
            {totalVotes}
          </h2>
        </div>

        {/* Winner */}
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-xs text-gray-400 tracking-widest">
            WINNER
          </p>
          <h2 className="text-lg mt-2 text-[#080838]">
            {winner ? winner.name : "No votes yet"}
          </h2>
        </div>

        {/* Turnout */}
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-xs text-gray-400 tracking-widest">
            TURNOUT
          </p>
          <h2 className="text-2xl mt-2">
            {totalVotes > 0 ? "100%" : "0%"}
          </h2>
        </div>

      </div>

      {/* 🔹 MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-xs text-gray-400 tracking-widest mb-4">
            VOTES BY OPTION
          </p>

          <PollChart data={chartData} />
        </div>

        {/* Ranked Table */}
        <div className="bg-white p-6 rounded-xl border">

          <p className="text-xs text-gray-400 tracking-widest mb-4">
            RANKED RESULTS
          </p>

          <h2 className="text-lg font-semibold mb-4">
            {selectedPoll.title}
          </h2>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b">
              <tr>
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">Option</th>
                <th className="text-left py-2">Votes</th>
                <th className="text-left py-2">%</th>
              </tr>
            </thead>

            <tbody>
              {[...chartData]
                .sort((a, b) => b.votes - a.votes)
                .map((opt, index) => {
                  const percent =
                    totalVotes === 0
                      ? 0
                      : ((opt.votes / totalVotes) * 100).toFixed(1);

                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2">#{index + 1}</td>
                      <td>{opt.name}</td>
                      <td>{opt.votes}</td>
                      <td>{percent}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}