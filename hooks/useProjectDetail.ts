import { useState, useEffect } from "react";
import { getProjectById } from "@/src/services/projectService";

export function useProjectDetail(id?: string) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getProjectById(id)
      .then(res => setProject(res.data.data || res.data))
      .catch(err => setError(err?.response?.data?.message || "Error al cargar el proyecto."))
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading, error };
} 