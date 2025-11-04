"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/getUserInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user");
        setUser({ userId: data.userId, email: data.email });
      })
      .catch(() => {
      });

  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Signed in as: {user.email}</p>
          <p>User ID: {user.userId}</p>
        </div>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}