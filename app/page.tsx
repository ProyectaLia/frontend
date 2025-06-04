"use client"

import { useState } from "react"
import { Search, Filter, Plus, User, LogOut, Settings, FileText, Heart } from "lucide-react"
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

const projects = [
  {
    id: 1,
    title: "EcoTrack - App de Sostenibilidad",
    creator: "María González",
    description: "Aplicación móvil para rastrear y gamificar hábitos ecológicos en el campus universitario.",
    skills: ["React Native", "Node.js", "MongoDB", "UX/UI Design"],
    area: "Tecnología Verde",
    status: "Buscando Colaboradores",
    collaboratorsNeeded: 3,
  },
  {
    id: 2,
    title: "StudyBuddy - Plataforma de Estudio",
    creator: "Carlos Mendoza",
    description: "Red social para formar grupos de estudio y compartir recursos académicos entre estudiantes.",
    skills: ["React", "Python", "PostgreSQL", "Machine Learning"],
    area: "Educación",
    status: "Buscando Colaboradores",
    collaboratorsNeeded: 2,
  },
  {
    id: 3,
    title: "CampusFood - Delivery Universitario",
    creator: "Ana Rodríguez",
    description: "Plataforma de delivery exclusiva para campus universitarios con opciones saludables.",
    skills: ["Flutter", "Firebase", "Marketing Digital", "Diseño Gráfico"],
    area: "Emprendimiento",
    status: "En Desarrollo",
    collaboratorsNeeded: 1,
  },
  {
    id: 4,
    title: "MindWell - Salud Mental Estudiantil",
    creator: "Diego Herrera",
    description: "App de bienestar mental con recursos, meditación guiada y conexión con profesionales.",
    skills: ["Vue.js", "Express.js", "Psicología", "Content Writing"],
    area: "Salud y Bienestar",
    status: "Buscando Colaboradores",
    collaboratorsNeeded: 4,
  },
]

const skillsFilter = ["React", "Python", "Node.js", "UX/UI Design", "Machine Learning", "Flutter", "Marketing Digital"]
const areasFilter = [
  "Tecnología Verde",
  "Educación",
  "Emprendimiento",
  "Salud y Bienestar",
  "Investigación",
  "Arte y Cultura",
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Simulating logged in state

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => project.skills.includes(skill))
    const matchesArea = !selectedArea || project.area === selectedArea

    return matchesSearch && matchesSkills && matchesArea
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PH</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ProyectaLia Hub
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                Explorar Proyectos
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/create-project" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Crear Proyecto
                  </Link>
                  <Link href="/my-projects" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Mis Proyectos
                  </Link>
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                        <AvatarFallback className="bg-purple-100 text-purple-600">JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Ver Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Editar Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Mis Solicitudes</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
                    Iniciar Sesión
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
                  {areasFilter.map((area) => (
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
        {isLoggedIn && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={project.status === "Buscando Colaboradores" ? "default" : "secondary"}
                    className={
                      project.status === "Buscando Colaboradores"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4" />
                  </Button>
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
                    {project.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-purple-200 text-purple-700">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                        +{project.skills.length - 3} más
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

                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron proyectos</h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros de búsqueda o explora todas las categorías.
            </p>
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
          </div>
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
