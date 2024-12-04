"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    users: 0,
    buses: 0,
    stops: 0,
  });

  useEffect(() => {
    // Mock API call to fetch statistics
    const fetchStats = async () => {
      const mockData = {
        users: 50,
        buses: 20,
        stops: 100,
      };
      setStats(mockData);
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out");
    // Example: Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-semibold text-black justify-center items-center">
        Welcome to the Admin Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 items-end justify-end"
      >
        Logout
      </button>
    </div>
  );
}
