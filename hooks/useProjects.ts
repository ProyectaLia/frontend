import { useState, useEffect } from "react";
import { getMyProjects, getMyCollaboratingProjects } from "@/src/services/projectService";

export function useProjects(enabled: boolean = true) {
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    Promise.all([
      getMyProjects().then(res => res.data.data || res.data).catch(() => []),
      getMyCollaboratingProjects().then(res => res.data.data || res.data).catch(() => [])
    ])
      .then(([my, collab]) => {
        setMyProjects(my);
        setCollaborations(collab);
      })
      .catch(() => setError("Error al cargar tus proyectos"))
      .finally(() => setLoading(false));
  }, [enabled]);

  return { myProjects, collaborations, loading, error };
} 