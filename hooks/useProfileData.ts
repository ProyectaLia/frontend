import { useState, useEffect } from "react";
import { getMyProjects, getMyCollaboratingProjects } from "@/src/services/projectService";

export function useProfileData(isOwnProfile: boolean, user: any) {
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOwnProfile || !user) return;
    setLoading(true);
    Promise.all([
      getMyProjects().then(res => res.data.data || res.data).catch(() => []),
      getMyCollaboratingProjects().then(res => res.data.data || res.data).catch(() => [])
    ]).then(([my, collab]) => {
      setMyProjects(my);
      setCollaborations(collab);
    }).finally(() => setLoading(false));
  }, [isOwnProfile, user]);

  return { myProjects, collaborations, loading };
} 