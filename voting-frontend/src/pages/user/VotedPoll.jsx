import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PollsAPI } from "../../api/pollsApi";
import { VotesAPI } from "../../api/votesApi";

export default function VotedPoll() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [vote, setVote] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pollRes, voteRes] = await Promise.all([
          PollsAPI.getById(id),
          VotesAPI.getStatus(id),
        ]);

        setPoll(pollRes?.data?.data);
        setVote(voteRes?.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  if (!poll || !vote) {
    return <p className="p-6">Loading...</p>;
  }

  // 🔥 find selected option object
  const selectedOption = poll.options.find(
    (opt) => opt._id === vote.optionId
  );

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Success message */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
        <h1 className="text-green-700 font-bold text-lg">
          ✅ You already voted
        </h1>

        <p className="mt-2 text-green-600">
          Your choice:{" "}
          <b>{selectedOption?.name}</b>
        </p>

        <p className="text-sm text-green-500">
          {selectedOption?.description}
        </p>
      </div>

      {/* Poll title */}
      <h2 className="text-xl font-bold mb-4">{poll.title}</h2>

      {/* Options (disabled view) */}
      <div className="space-y-3">
        {poll.options.map((opt) => (
          <div
            key={opt._id}
            className={`border p-3 rounded ${
              opt._id === vote.optionId
                ? "bg-green-100 border-green-400"
                : "opacity-50"
            }`}
          >
            <p className="font-medium">{opt.name}</p>
            <p className="text-sm text-gray-500">
              {opt.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}