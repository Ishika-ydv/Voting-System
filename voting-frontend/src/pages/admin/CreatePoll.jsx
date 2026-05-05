import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PollsAPI } from "../../api/pollsApi";

import OptionsBuilder from "../../components/admin/OptionsBuilder";
import Navbar from "../../components/common/Navbar";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function CreatePoll() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🧠 Validation
  const validate = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!startsAt || !endsAt) {
      toast.error("Start and End date are required");
      return false;
    }

    if (new Date(startsAt) >= new Date(endsAt)) {
      toast.error("Start date must be before End date");
      return false;
    }

    const cleaned = options.map((o) => o.trim()).filter(Boolean);

    if (cleaned.length < 2) {
      toast.error("At least 2 valid options required");
      return false;
    }

    return true;
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description: desc.trim(),
        startsAt,
        endsAt,
        options: options
          .map((o) => o.trim())
          .filter(Boolean)
          .map((name) => ({ name })),
      };

      await PollsAPI.create(payload);

      toast.success("Poll created successfully 🎉");

      navigate("/admin/polls");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create poll"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* <Navbar /> */}

      <div className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create Poll
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 border flex flex-col gap-5"
        >

          {/* Title */}
          <Input
            label="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Options */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Options
            </label>

            <OptionsBuilder
              options={options}
              onChange={setOptions}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Starts At"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />

            <Input
              label="Ends At"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Poll"}
          </Button>

        </form>
      </div>
    </div>
  );
}