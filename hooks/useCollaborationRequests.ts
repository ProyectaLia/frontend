import { useState, useEffect } from "react";

export function useCollaborationRequests(fetcher: () => Promise<any>, enabled: boolean = true) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    fetcher()
      .then(res => setRequests(res.data.data || res.data))
      .catch(() => setError("Error al cargar las solicitudes."))
      .finally(() => setLoading(false));
  }, [fetcher, enabled]);

  return { requests, loading, error };
} 