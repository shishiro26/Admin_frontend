"use client";
import { useState } from "react";
import HeaderWithBackButton from "./headerwithbutton"; // Reuse the header component
import axios from "axios";

interface Stop {
  stopName: string;
  stopTimings: string;
  stopDuration: number;
}

export default function CreateCityPage() {
  const [formData, setFormData] = useState({
    cityName: "",
    cityPincode: "",
    stops: [] as Stop[],
  });

  const [newStop, setNewStop] = useState<Stop>({
    stopName: "",
    stopTimings: "",
    stopDuration: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStopChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewStop({
      ...newStop,
      [name]: name === "stopDuration" ? parseInt(value, 10) : value,
    });
  };

  const addStop = () => {
    if (
      !newStop.stopName ||
      !newStop.stopTimings ||
      newStop.stopDuration <= 0
    ) {
      alert("Please fill out all fields for the stop.");
      return;
    }
    setFormData({
      ...formData,
      stops: [...formData.stops, newStop],
    });
    setNewStop({ stopName: "", stopTimings: "", stopDuration: 0 });
  };

  const removeStop = (index: number) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate cityName and cityPincode
    if (!formData.cityName.trim()) {
      setError("City Name is required.");
      setLoading(false);
      return;
    }
    if (!/^\d{6}$/.test(formData.cityPincode)) {
      setError("City Pincode must be a 6-digit number.");
      setLoading(false);
      return;
    }

    const formattedStops = formData.stops.map((stop) => ({
      ...stop,
      stopId: stop.stopName.replace(/\s+/g, "-").toLowerCase(), // Generate stopId
    }));

    console.log(formData.cityName);
    console.log(formData.cityPincode);
    console.log(formattedStops);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cities/create`,
        {
          cityName: formData.cityName,
          cityPincode: formData.cityPincode,
          stops: formattedStops,
        }
      );

      console.log("City Created Successfully:", response.data);

      // Reset the form
      setFormData({
        cityName: "",
        cityPincode: "",
        stops: [],
      });
      setNewStop({ stopName: "", stopTimings: "", stopDuration: 0 });

      alert("City created successfully!");
    } catch (err) {
      console.error("Error creating city:", err);
      setError("Failed to create city. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header Section */}
      <HeaderWithBackButton
        title="Create a City"
        backRoute="/admin/dashboard"
      />

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          City Details
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 bg-red-100 p-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* City Name */}
        <label className="block text-gray-600 font-medium mb-2">
          City Name
        </label>
        <input
          type="text"
          name="cityName"
          value={formData.cityName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
          placeholder="Enter City Name"
          required
        />

        {/* City Pincode */}
        <label className="block text-gray-600 font-medium mb-2">
          City Pincode
        </label>
        <input
          type="number"
          name="cityPincode"
          value={formData.cityPincode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
          placeholder="Enter 6-digit Pincode"
          required
        />

        {/* Stops Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Stops</h3>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {/* Stop Name */}
          <label className="block text-gray-600 font-medium mb-2">
            Stop Name
          </label>
          <input
            type="text"
            name="stopName"
            value={newStop.stopName}
            onChange={handleStopChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
            placeholder="Enter Stop Name"
          />

          {/* Stop Timings */}
          <label className="block text-gray-600 font-medium mb-2">
            Stop Timings
          </label>
          <input
            type="time"
            name="stopTimings"
            value={newStop.stopTimings}
            onChange={handleStopChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
          />

          {/* Stop Duration */}
          <label className="block text-gray-600 font-medium mb-2">
            Stop Duration (in minutes)
          </label>
          <input
            type="number"
            name="stopDuration"
            value={newStop.stopDuration}
            onChange={handleStopChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
            placeholder="Enter Duration in Minutes"
          />

          {/* Add Stop Button */}
          <button
            type="button"
            onClick={addStop}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Add Stop
          </button>
        </div>

        {/* List of Stops */}
        <ul>
          {formData.stops.map((stop, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2 text-black"
            >
              <span>
                <strong>{stop.stopName}</strong> - {stop.stopTimings} (
                {stop.stopDuration} mins)
              </span>
              <button
                type="button"
                onClick={() => removeStop(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit City"}
        </button>
      </form>
    </div>
  );
}
