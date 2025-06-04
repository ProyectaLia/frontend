"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Users, Plus, Search } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getMyProjects, getMyCollaboratingProjects } from "@/src/services/projectService"
import { useAuth } from "@/src/context/AuthContext"

export default function MyProjectsPage() {
  const [activeTab, setActiveTab] = useState("created")
  const [myProjects, setMyProjects] = useState<any[]>([])
  const [collaboratingProjects, setCollaboratingProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { loading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (authLoading) return // Espera a que AuthContext termine de cargar
    if (!isAuthenticated) return // No intentes cargar si no está autenticado
    setLoading(true)
    setError("")
    Promise.all([
      getMyProjects().then(res => res.data.data || res.data).catch(() => []),
      getMyCollaboratingProjects().then(res => res.data.data || res.data).catch(() => [])
    ])
      .then(([my, collab]) => {
        setMyProjects(my)
        setCollaboratingProjects(collab)
      })
      .catch(() => setError("Error al cargar tus proyectos"))
      .finally(() => setLoading(false))
  }, [authLoading, isAuthenticated])

  // Agrega función para mostrar el estado de forma amigable
  function getStatusLabel(status: string) {
    switch ((status || '').toUpperCase()) {
      case 'BUSCANDO_COLABORADORES':
        return 'Buscando Colaboradores';
      case 'EN_DESARROLLO':
        return 'En Desarrollo';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return status || 'Desconocido';
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
              <p className="text-gray-600">Gestiona tus proyectos y colaboraciones</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Link href="/create-project">
                <Plus size={18} className="mr-2" />
                Crear Nuevo Proyecto
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="created" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="created">Proyectos Creados</TabsTrigger>
              <TabsTrigger value="collaborating">Colaboraciones</TabsTrigger>
            </TabsList>

            <TabsContent value="created">
              {loading ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-10 w-10 text-purple-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando proyectos...</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">{error ? error : "Por favor, espera mientras se cargan tus proyectos."}</p>
                </div>
              ) : myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={getStatusLabel(project.status) === "Buscando Colaboradores" ? "default" : "secondary"}
                            className={
                              getStatusLabel(project.status) === "Buscando Colaboradores"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {(project.collaborators?.length ?? 0)} colaboradores
                          {project.collaboratorsNeeded > 0 && ` • Buscando ${project.collaboratorsNeeded} más`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 line-clamp-3">{project.description}</p>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Habilidades Requeridas:</p>
                          <div className="flex flex-wrap gap-2">
                            {((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs border-purple-200 text-purple-700">
                                {skill}
                              </Badge>
                            ))}
                            {((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                                +{((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            {project.area}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Link href={`/projects/${project.id}/edit`}>
                              <Edit size={16} className="mr-2" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            asChild
                            className={`flex-1 ${
                              project.applicationsCount > 0
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Link href={`/projects/${project.id}/applications`}>
                              <Users size={16} className="mr-2" />
                              {project.applicationsCount > 0
                                ? `Ver Solicitudes (${project.applicationsCount})`
                                : "Sin Solicitudes"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no has creado proyectos</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Comparte tus ideas y encuentra colaboradores talentosos para hacerlas realidad.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Link href="/create-project">Crear Mi Primer Proyecto</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collaborating">
              {loading ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-purple-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando colaboraciones...</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">{error ? error : "Por favor, espera mientras se cargan tus colaboraciones."}</p>
                </div>
              ) : collaboratingProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaboratingProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={getStatusLabel(project.status) === "Buscando Colaboradores" ? "default" : "secondary"}
                            className={
                              getStatusLabel(project.status) === "Buscando Colaboradores"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {getStatusLabel(project.status)}
                          </Badge>
                          <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                            {project.role}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          por <span className="font-medium text-purple-600">{project.creator}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 line-clamp-3">{project.description}</p>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Habilidades Requeridas:</p>
                          <div className="flex flex-wrap gap-2">
                            {((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs border-purple-200 text-purple-700">
                                {skill}
                              </Badge>
                            ))}
                            {((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                                +{((project.requiredSkills ?? project.skills ?? '').split(',').map((skill: string) => skill.trim()).filter(Boolean)).length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            {project.area}
                          </Badge>
                        </div>

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
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no colaboras en proyectos</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Explora proyectos interesantes y postúlate para colaborar con otros estudiantes.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Link href="/">Explorar Proyectos</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
    </ProtectedRoute>
  )
}
