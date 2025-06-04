"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit, Users, Calendar, MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo para el proyecto
const projectData = {
  id: "1",
  title: "EcoTrack - App de Sostenibilidad",
  creator: {
    id: "1",
    name: "María González",
    avatar: "/placeholder-user.jpg",
  },
  createdAt: "2023-10-15",
  description:
    "EcoTrack es una aplicación móvil diseñada para ayudar a los estudiantes universitarios a rastrear y gamificar sus hábitos ecológicos en el campus. La aplicación permitirá a los usuarios registrar acciones sostenibles como reciclaje, uso de transporte público, reducción de consumo de plásticos, etc., y ganar puntos que pueden ser canjeados por beneficios en el campus.",
  objectives: [
    "Desarrollar una interfaz de usuario intuitiva y atractiva para fomentar el uso continuo.",
    "Implementar un sistema de gamificación que motive a los estudiantes a adoptar hábitos sostenibles.",
    "Crear un dashboard para visualizar el impacto ambiental colectivo del campus.",
    "Integrar un sistema de recompensas que permita canjear puntos por beneficios reales en el campus.",
    "Implementar funcionalidades sociales para que los estudiantes puedan compartir sus logros y competir amistosamente.",
  ],
  skills: ["React Native", "Node.js", "MongoDB", "UX/UI Design", "Gamification", "Firebase", "Express.js", "Git"],
  area: "Tecnología Verde",
  status: "Buscando Colaboradores",
  collaboratorsNeeded: 3,
  collaborators: [
    {
      id: "2",
      name: "Carlos Mendoza",
      role: "Backend Developer",
      avatar: "/placeholder-user.jpg",
    },
  ],
  isCreator: true, // Simulando que el usuario actual es el creador
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // En una aplicación real, usaríamos params.id para obtener los datos del proyecto
  const [applicationMessage, setApplicationMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleApply = () => {
    // Aquí iría la lógica para enviar la solicitud
    console.log("Enviando solicitud:", applicationMessage)
    setIsDialogOpen(false)
    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud ha sido enviada correctamente. Te notificaremos cuando haya una respuesta.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header con navegación básica */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ProyectaLia Hub
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                Explorar Proyectos
              </Link>
              <Link href="/create-project" className="text-gray-600 hover:text-purple-600 transition-colors">
                Crear Proyecto
              </Link>
              <Link href="/my-projects" className="text-gray-600 hover:text-purple-600 transition-colors">
                Mis Proyectos
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                <AvatarFallback className="bg-purple-100 text-purple-600">MG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación de regreso */}
        <div className="mb-6">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span>Volver a Explorar Proyectos</span>
          </Link>
        </div>

        {/* Cabecera del proyecto */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={projectData.status === "Buscando Colaboradores" ? "default" : "secondary"}
                  className={
                    projectData.status === "Buscando Colaboradores"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {projectData.status}
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {projectData.area}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{projectData.title}</h1>

              <div className="flex items-center gap-3">
                <Link href={`/profile/${projectData.creator.id}`} className="flex items-center gap-2 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={projectData.creator.avatar || "/placeholder.svg"}
                      alt={projectData.creator.name}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {projectData.creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-purple-600 group-hover:text-purple-800 transition-colors font-medium">
                    {projectData.creator.name}
                  </span>
                </Link>
                <span className="text-gray-500 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(projectData.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {projectData.isCreator ? (
                <>
                  <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Link href={`/projects/${projectData.id}/edit`}>
                      <Edit size={16} className="mr-2" />
                      Editar Proyecto
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Link href={`/projects/${projectData.id}/applications`}>
                      <Users size={16} className="mr-2" />
                      Ver Solicitudes
                    </Link>
                  </Button>
                </>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      Postularme a este Proyecto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Postularte para {projectData.title}</DialogTitle>
                      <DialogDescription>
                        Envía un mensaje al creador del proyecto explicando por qué te interesa y cómo puedes
                        contribuir.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Cuéntanos por qué te interesa este proyecto y qué habilidades puedes aportar..."
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleApply}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Enviar Solicitud
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del proyecto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción del Proyecto</h2>
              <p className="text-gray-700 whitespace-pre-line">{projectData.description}</p>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivos Principales</h2>
              <ul className="space-y-3">
                {projectData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5 font-medium text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colaboradores actuales */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Equipo Actual</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={projectData.creator.avatar || "/placeholder.svg"}
                        alt={projectData.creator.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {projectData.creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{projectData.creator.name}</p>
                      <p className="text-sm text-purple-600">Líder del Proyecto</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    Creador
                  </Badge>
                </div>

                {projectData.collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{collaborator.name}</p>
                        <p className="text-sm text-indigo-600">{collaborator.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                      Colaborador
                    </Badge>
                  </div>
                ))}

                {projectData.collaboratorsNeeded > 0 && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                    <p className="text-gray-600">
                      <Users size={20} className="inline mr-2 text-gray-400" />
                      Buscando {projectData.collaboratorsNeeded} colaboradores más
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="space-y-6">
            {/* Habilidades requeridas */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Habilidades Requeridas</h2>
              <div className="flex flex-wrap gap-2">
                {projectData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Información del Proyecto</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Área Temática:</span>
                  <span className="font-medium text-gray-900">{projectData.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-gray-900">{projectData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colaboradores Necesarios:</span>
                  <span className="font-medium text-gray-900">{projectData.collaboratorsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Publicación:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(projectData.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">¿Tienes Preguntas?</h2>
              <p className="text-gray-600 mb-4">
                Si tienes dudas sobre este proyecto, puedes contactar directamente al creador.
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                <MessageSquare size={16} className="mr-2" />
                Contactar al Creador
              </Button>
            </div>
          </div>
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
