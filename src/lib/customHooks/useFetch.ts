import { data } from "motion/react-client";
import { useState, useEffect } from "react";

const useFetchData = (path: string) => {
    const [userData, setUserData] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
  
  useEffect(() => {
      async function fetchData() {
          setLoading(true)
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
            method: "GET",
          });
  
          const data = await res.json();
  
          if (!data.user) {
            return;
          }
  
         setUserData(data)
        } catch (error) {
          console.error("Authentication error:", error);
     
        } finally {
          setLoading(false)
        }
      }
  
      fetchData();
    }, []);
  
    return { data, loading};
  };
  
  export default useFetchData;