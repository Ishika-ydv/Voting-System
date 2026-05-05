import { useEffect, useState } from "react";
import { PollsAPI } from "../../api/pollsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { VotesAPI } from "../../api/votesApi";
import { getPollStatus } from "../../utils/pollStatus";

const TABS = ["ACTIVE", "UPCOMING", "ENDED"];

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [tab, setTab] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔥 Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await PollsAPI.getAll();
        setPolls(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // 🧠 Smart navigation
  const handlePollClick = async (pollId) => {
    try {
      const res = await VotesAPI.getStatus(pollId);

      if (res.data.hasVoted) {
        navigate(`/polls/${pollId}/voted`);
      } else {
        navigate(`/polls/${pollId}`);
      }
    } catch {
      navigate(`/polls/${pollId}`);
    }
  };

  const filteredPolls = polls.filter((p) => {
    return getPollStatus(p.startsAt, p.endsAt) === tab;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-6 py-10">

      {/* 🔷 HEADER */}
      <div className="max-w-7xl mx-auto mb-10 ml-7">

        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">
          The Ballot Hall
        </p>

        <h1 className="text-5xl font-serif text-gray-900 leading-tight">
          Welcome back,{" "}
          <span className="italic">{user?.name}</span>.
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl text-sm">
          Browse open ballots, review the upcoming docket, or revisit completed decisions.
          Each vote is final and counted once.
        </p>

        <div className="h-0.5 w-10 bg-yellow-500 mt-4"></div>
      </div>

      {/* 🔹 Tabs */}
      <div className="max-w-7xl mx-auto flex gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === t
                ? "bg-white shadow-sm border text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* ⏳ Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading polls...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

          {filteredPolls.length > 0 ? (
            filteredPolls.map((poll) => {
              const status = getPollStatus(
                poll.startsAt,
                poll.endsAt
              );

              return (
                <div
                  key={poll._id}
                  onClick={() => handlePollClick(poll._id)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition cursor-pointer"
                >

                  {/* 🔘 STATUS */}
                  <div className="flex justify-between items-center mb-4">
  <span
    className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border
      ${
        status === "ACTIVE"
          ? "text-green-600 border-green-500 bg-green-50"
          : status === "UPCOMING"
          ? "text-yellow-600 border-yellow-500 bg-yellow-50"
          : "text-gray-600 border-gray-300 bg-gray-100"
      }
    `}
  >
    <span
      className={`w-2 h-2 rounded-full
        ${
          status === "ACTIVE"
            ? "bg-green-500"
            : status === "UPCOMING"
            ? "bg-yellow-500"
            : "bg-gray-500"
        }
      `}
    ></span>

    {status}
  </span>

  <span className="text-gray-400 text-lg">↗</span>
</div>

                  {/* 🏛️ ORG */}
                  <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-2">
                    {poll.organization || "Department"}
                  </p>

                  {/* 📌 TITLE */}
                  <h2 className="text-xl font-serif text-gray-900 mb-2">
                    {poll.title}
                  </h2>

                  {/* 📝 DESC */}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {poll.description}
                  </p>

                  {/* 📅 FOOTER */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t text-sm text-gray-500">
                    <span>
                      {new Date(poll.startsAt).toLocaleDateString()} —{" "}
                      {new Date(poll.endsAt).toLocaleDateString()}
                    </span>

                    {status === "ENDED" && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/polls/${poll._id}/results`);
                        }}
                        className="text-gray-700 hover:underline"
                      >
                        View results →
                      </span>
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center text-gray-400">
              No polls available
            </p>
          )}
        </div>
      )}
    </div>
  );
}