"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { getAllProjects } from "@/src/services/projectService"
import { useDebounce } from "@/hooks/useDebounce"
import { stringToArray, getStatusLabel, AREAS, SKILLS } from "@/lib/profileUtils"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingMessage from "@/components/ui/LoadingMessage"
import EmptyState from "@/components/ui/EmptyState"

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 400)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState("")
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  // Estado para proyectos reales
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError("")
      try {
        const params: any = {}
        if (debouncedSearchTerm) params.search = debouncedSearchTerm
        if (selectedArea && selectedArea !== "all") params.areaTheme = selectedArea
        if (selectedSkills.length > 0) params.skills = selectedSkills.join(",")
        const res = await getAllProjects(params)
        setProjects(res.data.data || res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar proyectos.")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [debouncedSearchTerm, selectedArea, selectedSkills])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => project.skills.includes(skill))
    const matchesArea = !selectedArea || project.area === selectedArea

    return matchesSearch && matchesSkills && matchesArea
  })

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage description={error} className="max-w-lg mx-auto mt-12" />
      </main>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explora Proyectos{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Innovadores
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre ideas increíbles, conecta con estudiantes talentosos y colabora en proyectos que pueden cambiar el
            mundo.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar proyectos por palabra clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="Área Temática" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="h-12 px-6 border-purple-200 text-purple-600 hover:bg-purple-50">
                <Filter className="mr-2 h-4 w-4" />
                Más Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Create Project CTA */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">¿Tienes una idea increíble?</h3>
                <p className="text-purple-100">Comparte tu proyecto y encuentra colaboradores talentosos.</p>
              </div>
              <Button className="mt-4 sm:mt-0 bg-white text-purple-600 hover:bg-gray-100">
                <Plus className="mr-2 h-4 w-4" />
                Crear Proyecto
              </Button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <LoadingMessage key={i} />
            ))
          ) : (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={project.status === "BUSCANDO_COLABORADORES" ? "default" : "secondary"}
                      className={
                        project.status === "BUSCANDO_COLABORADORES"
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
                    por <span className="font-medium text-purple-600">{project.creator?.name || "Desconocido"}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 line-clamp-3">{project.description}</p>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Habilidades Requeridas:</p>
                    <div className="flex flex-wrap gap-2">
                      {stringToArray(project.requiredSkills ?? project.skills ?? '').slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs border-purple-200 text-purple-700">
                          {skill}
                        </Badge>
                      ))}
                      {stringToArray(project.requiredSkills ?? project.skills ?? '').length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                          +{stringToArray(project.requiredSkills ?? project.skills ?? '').length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      {project.area}
                    </Badge>
                    <span className="text-sm text-gray-500">{project.collaboratorsNeeded} colaboradores</span>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Link href={`/projects/${project.id}`}>Ver Detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <EmptyState
            icon={<Search className="h-12 w-12 text-purple-400" />}
            title="No se encontraron proyectos"
            description="Intenta ajustar tus filtros de búsqueda o explora todas las categorías."
            action={
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSkills([])
                  setSelectedArea("")
                }}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Limpiar Filtros
              </Button>
            }
            className="my-12"
          />
        )}
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
