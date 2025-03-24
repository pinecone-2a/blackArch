import { useState, useEffect } from "react";

export function usePostData<T>(path: string, body: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function postData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (body) {
      postData();
    }
  }, [path, body]); 

  return { data, loading, error };
}

export default usePostData;
