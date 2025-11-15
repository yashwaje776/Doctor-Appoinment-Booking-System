"use client";

import { setAvailability } from "@/actions/doctorDashboard";
import { useState } from "react";

export default function AvailabilityForm() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await setAvailability({ start, end });
    console.log(res);

    setMessage(res?.message || "Updated!");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md shadow-sm"
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">Start Time</label>
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">End Time</label>
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {loading ? "Saving..." : "Save Availability"}
      </button>

      {message && <p className="text-green-600 text-sm">{message}</p>}
    </form>
  );
}
