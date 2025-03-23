"use client"

import { createContext, useState, useEffect, ReactNode } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
