"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, ExternalLink, Github, Linkedin, Twitter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/src/context/AuthContext"
import { use } from "react"
import { useEffect, useState } from "react"
import { getMyProjects, getMyCollaboratingProjects } from "@/src/services/projectService"
import { stringToArray, getStatusLabel, AREAS, SKILLS } from "@/lib/profileUtils"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingMessage from "@/components/ui/LoadingMessage"

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const { id } = use(params);
  const isOwnProfile = user && String(user.id) === String(id);

  // Estado para proyectos y colaboraciones reales
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  useEffect(() => {
    if (isOwnProfile && user) {
      setLoadingProjects(true);
      Promise.all([
        getMyProjects().then(res => res.data.data || res.data).catch(() => []),
        getMyCollaboratingProjects().then(res => res.data.data || res.data).catch(() => [])
      ]).then(([my, collab]) => {
        setMyProjects(my);
        setCollaborations(collab);
      }).finally(() => setLoadingProjects(false));
    }
  }, [isOwnProfile, user]);

  if (loading) {
    return (
      <LoadingMessage message="Cargando perfil..." />
    );
  }

  if (!isOwnProfile) {
    return (
      <ErrorMessage description="No autorizado" className="max-w-lg mx-auto mt-12" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de perfil */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          {/* Cabecera del perfil */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600">
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full p-2"
              >
                <Edit size={20} />
              </Link>
            )}
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="absolute -top-16 flex items-center justify-center">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "Usuario"} />
                  <AvatarFallback className="text-3xl bg-purple-100 text-purple-600">
                    {(user?.name || "U")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-16 md:ml-36 md:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-lg text-gray-600">
                  {user?.career || ""} {user?.university ? `• ${user.university}` : ""}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {user?.portfolio || user?.portfolioLink ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.portfolio || user.portfolioLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-1" /> Portfolio
                    </a>
                  </Button>
                ) : null}
                {user?.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.github} target="_blank" rel="noopener noreferrer">
                      <Github size={16} className="mr-1" /> GitHub
                    </a>
                  </Button>
                )}
                {user?.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={16} className="mr-1" /> LinkedIn
                    </a>
                  </Button>
                )}
                {user?.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter size={16} className="mr-1" /> Twitter
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acerca de</h2>
              <p className="text-gray-700">{user?.bio || ""}</p>
            </div>

            {/* Habilidades e Intereses */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {stringToArray(user?.skills).map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Áreas de Interés</h2>
                <div className="flex flex-wrap gap-2">
                  {stringToArray(user?.interests).map((interest: string) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos y Colaboraciones */}
        <div className="mt-8">
          <Tabs defaultValue="projects">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="projects">Proyectos Creados</TabsTrigger>
              <TabsTrigger value="collaborations">Colaboraciones</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              {loadingProjects ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando proyectos...</h3>
                </div>
              ) : myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                        <Badge
                  variant={getStatusLabel(project.status) === "Buscando Colaboradores" ? "default" : "secondary"}
                  className={
                    getStatusLabel(project.status) === "Buscando Colaboradores"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {getStatusLabel(project.status)}
                </Badge>
                          {project.role && (
                            <Badge variant="outline" className="border-purple-200 text-purple-700">
                              {project.role}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          <Link href={`/projects/${project.id}`}>Ver Proyecto</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay proyectos creados</h3>
                  <p className="text-gray-600">Aún no has creado ningún proyecto.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="collaborations">
              {loadingProjects ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando colaboraciones...</h3>
                </div>
              ) : collaborations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaborations.map((collab) => (
                    <Card key={collab.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <Badge
                          variant={getStatusLabel(collab.status) === "Buscando Colaboradores" ? "default" : "secondary"}
                          className={
                            getStatusLabel(collab.status) === "Buscando Colaboradores"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {getStatusLabel(collab.status)}
                        </Badge>
                          {collab.role && (
                            <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                              {collab.role}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{collab.title}</h3>
                        <p className="text-gray-600 mb-4">{collab.description}</p>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          <Link href={`/projects/${collab.id}`}>Ver Proyecto</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay colaboraciones</h3>
                  <p className="text-gray-600">Aún no has colaborado en ningún proyecto.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">PH</span>
              </div>
              <span className="font-semibold text-gray-900">ProyectaLia Hub</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/about" className="hover:text-purple-600 transition-colors">
                Acerca de
              </Link>
              <Link href="/contact" className="hover:text-purple-600 transition-colors">
                Contacto
              </Link>
              <Link href="/terms" className="hover:text-purple-600 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
