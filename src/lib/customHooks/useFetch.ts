import { data } from "motion/react-client";
import { useState, useEffect } from "react";

export function useFetchData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
  
  useEffect(() => {
      async function fetchData() {
          setLoading(true)
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
            method: "GET",
          });
  
          const data = await res.json();
  
          if (!data) {
            return;
          }
  
         setData(data.message)
        } catch (error) {
          console.error(" error:", error);
     
        } finally {
          setLoading(false)
        }
      }
  
      fetchData();
    }, []);
  
    return { data, loading};
  };
  
  export default useFetchData;