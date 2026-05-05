import { useNavigate } from "react-router-dom";
import { getPollStatus } from "../../utils/pollStatus";

export default function PollCard({ poll }) {
  const navigate = useNavigate();

  const status = getPollStatus(poll?.startsAt, poll?.endsAt) || "UPCOMING";

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-700",
    UPCOMING: "bg-amber-100 text-amber-700",
    ENDED: "bg-gray-100 text-gray-600",
  };

  const handleClick = () => {
    if (!poll?._id) return;

    if (status === "ACTIVE") {
      navigate(`/polls/${poll._id}`);
    } else if (status === "ENDED") {
      navigate(`/polls/${poll._id}/results`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md transition select-none"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">
          {poll?.title || "Untitled Poll"}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            statusStyles[status]
          }`}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {poll?.description || "No description available"}
      </p>

      {/* Footer */}
      <p className="text-xs text-gray-400">
        {poll?.totalVotes || 0} vote
        {(poll?.totalVotes || 0) !== 1 ? "s" : ""}
      </p>
    </div>
  );
}