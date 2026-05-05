import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PollsAPI } from "../../api/pollsApi";
import OptionsBuilder from "../../components/admin/OptionsBuilder";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function CreatePoll() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // ✅ UPDATED STRUCTURE
  const [options, setOptions] = useState([
    { name: "", description: "", image: null },
    { name: "", description: "", image: null },
  ]);

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ VALIDATION
  const validate = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!startsAt || !endsAt) {
      toast.error("Start and End date required");
      return false;
    }

    if (new Date(startsAt) >= new Date(endsAt)) {
      toast.error("Start must be before End");
      return false;
    }

    if (options.length < 2) {
      toast.error("At least 2 options required");
      return false;
    }

    return true;
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", desc);
      formData.append("startsAt", startsAt);
      formData.append("endsAt", endsAt);

      // ✅ send options properly
      options.forEach((opt, i) => {
        formData.append(`options[${i}][name]`, opt.name);
        formData.append(`options[${i}][description]`, opt.description);

        if (opt.image) {
          formData.append("optionImages", opt.image);
        }
      });

      await PollsAPI.create(formData);

      toast.success("Poll created successfully 🎉");
      navigate("/admin/polls");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold mb-6">Create Poll</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border flex flex-col gap-5"
        >

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded"
          />

          {/* OPTIONS */}
          <OptionsBuilder
            options={options}
            onChange={setOptions}
          />

          <Input
            type="datetime-local"
            label="Start"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />

          <Input
            type="datetime-local"
            label="End"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Poll"}
          </Button>

        </form>
      </div>
    </div>
  );
}