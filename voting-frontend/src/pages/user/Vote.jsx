import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getPollResults } from "../../api/resultsApi";
import { castVote } from "../../api/votesApi";

import Button from "../../components/common/Button";

export default function Vote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🔥 Fetch poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setFetching(true);
        const res = await getPollResults(id);
        setPoll(res?.data);
      } catch {
        toast.error("Failed to load poll");
      } finally {
        setFetching(false);
      }
    };

    fetchPoll();
  }, [id]);

  // 🗳️ Submit vote
  const handleVote = async () => {
    if (!selected) {
      toast.error("Please select an option");
      return;
    }

    setLoading(true);

    try {
      await castVote(id, selected);

      setVoted(true);
      toast.success("Vote submitted successfully 🎉");
    } catch (err) {
      const status = err?.response?.status;

      // already voted
      if (status === 409) {
        setVoted(true);
        toast.error("You have already voted");
      } else {
        toast.error(
          err?.response?.data?.message || "Vote failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading state
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading poll...</p>
      </div>
    );
  }

  // 🚨 No poll found
  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Poll not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {poll.title}
        </h1>

        <p className="text-gray-500 mb-6">
          {poll.description}
        </p>

        {/* Already voted */}
        {voted ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-5 text-green-700">
            <p className="font-medium">Vote submitted successfully 🎉</p>

            <button
              onClick={() => navigate(`/polls/${id}/results`)}
              className="underline mt-2 inline-block"
            >
              View results
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Options */}
            {poll.options?.map((opt) => (
              <label
                key={opt._id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  selected === opt._id
                    ? "border-blue-500 bg-blue-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={opt._id}
                  checked={selected === opt._id}
                  onChange={() => setSelected(opt._id)}
                />

                <span className="font-medium text-gray-700">
                  {opt.name}
                </span>
              </label>
            ))}

            {/* Submit */}
            <Button
              onClick={handleVote}
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}