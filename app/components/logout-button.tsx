"use client";
import React from "react";

const LogoutButton = () => {
  return (
    <span
      onClick={() => {
        localStorage.removeItem("authToken");
      }}
    >
      Sign out
    </span>
  );
};

export default LogoutButton;
