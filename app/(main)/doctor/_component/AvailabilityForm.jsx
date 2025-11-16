"use client";

import { setAvailability } from "@/actions/doctorDashboard";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AvailabilityForm({ availability }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (availability) {
      setStart(availability.start || "");
      setEnd(availability.end || "");
    }
  }, [availability]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await setAvailability({ start, end });
      toast.success(res?.message || "Availability updated!");

      setIsEditing(false); 
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    }

    setLoading(false);
  }

  if (!isEditing) {
    return (
      <div className="p-4 border rounded-md shadow-sm space-y-3">
        <p className="text-sm font-medium">Current Availability:</p>

        {availability ? (
          <>
            <p>Start: <b>{availability.start}</b></p>
            <p>End: <b>{availability.end}</b></p>
          </>
        ) : (
          <p className="text-muted-foreground">Not set yet</p>
        )}

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setIsEditing(true)}
        >
          Update Availability
        </button>
      </div>
    );
  }

  // ----------------------------------
  // 2️⃣ SHOW FORM WHEN EDITING
  // ----------------------------------
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded-md"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
