"use client";

import React, { useState, useEffect } from "react";

export const Home = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  return <h1>{userId}</h1>;
};
