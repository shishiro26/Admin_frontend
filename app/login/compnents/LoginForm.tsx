"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock API call or authentication logic
    if (username === "admin" && phone === "1234567890") {
      localStorage.setItem("authToken", "mockToken123");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or phone number");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 max-w-md mx-auto bg-black text-white rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 bg-white text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 bg-white text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Login
        </button>
      </div>
    </form>
  );
}
