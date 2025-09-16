"use client";

import React from "react";

export const Home = () => {
  let userId;

  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userId");
  }

  return <h1>{userId}</h1>;
};
