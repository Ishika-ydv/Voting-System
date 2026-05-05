import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { PollsAPI } from "../../api/pollsApi";
import { VotesAPI } from "../../api/votesApi";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button";

export default function Vote() {
  const { id } = useParams();
  const { isVoter } = useAuth();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);

  // 🚫 BLOCK ADMIN
  if (!isVoter) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied 🚫
        </h1>
        <p className="mt-2 text-gray-600">
          Only users are allowed to vote.
        </p>
      </div>
    );
  }

  // 🔥 FETCH POLL
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await PollsAPI.getById(id);
        setPoll(res?.data?.data);
      } catch (err) {
        toast.error("Failed to load poll");
      }
    };

    fetchPoll();
  }, [id]);

  // 🧠 HANDLE VOTE
  const handleVote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    try {
      setLoading(true);

      // ✅ IMPORTANT FIX: send object
      await VotesAPI.vote({
        pollId: id,
        optionId: selectedOption,
      });

      // find chosen option
      const chosen = poll?.options?.find(
        (opt) => opt._id === selectedOption
      );

      setHasVoted(true);
      setVotedOption(chosen);

      toast.success("Vote submitted 🎉");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Vote failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!poll) {
    return <p className="p-6">Loading poll...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* ✅ SUCCESS UI */}
      {hasVoted && votedOption && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="text-green-700 font-semibold">
            ✅ You already voted
          </h2>

          <p className="text-green-600 mt-1">
            Your choice: <b>{votedOption.name}</b>
          </p>

          {votedOption.description && (
            <p className="text-sm text-green-500">
              {votedOption.description}
            </p>
          )}
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-2">
        {poll.title}
      </h1>

      <p className="text-gray-600 mb-4">
        {poll.description}
      </p>

      {/* OPTIONS */}
      <div className="space-y-3">
        {poll.options?.map((opt) => (
          <label
            key={opt._id}
            className={`flex items-center gap-3 border p-3 rounded transition ${
              hasVoted
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="vote"
              value={opt._id}
              disabled={hasVoted}
              onChange={() => setSelectedOption(opt._id)}
            />

            <div>
              <p className="font-medium">{opt.name}</p>
              <p className="text-sm text-gray-500">
                {opt.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* BUTTON */}
      <Button
        onClick={handleVote}
        disabled={loading || hasVoted}
        className="mt-5"
      >
        {hasVoted
          ? "Already Voted"
          : loading
          ? "Voting..."
          : "Submit Vote"}
      </Button>
    </div>
  );
}