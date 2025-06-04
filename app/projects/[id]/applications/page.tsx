"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Check, X, MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo para el proyecto
const projectData = {
  id: "1",
  title: "EcoTrack - App de Sostenibilidad",
}

// Datos de ejemplo para las solicitudes
const applications = [
  {
    id: "1",
    userId: "2",
    userName: "Carlos Mendoza",
    userAvatar: "/placeholder-user.jpg",
    message:
      "¡Hola! Me interesa mucho este proyecto porque tengo experiencia en desarrollo móvil con React Native y he trabajado en proyectos relacionados con sostenibilidad. Me gustaría contribuir principalmente en el desarrollo del backend y la integración con APIs de sostenibilidad.",
    skills: ["React Native", "Node.js", "MongoDB", "Express.js"],
    appliedAt: "2023-10-20",
    status: "Pendiente",
  },
  {
    id: "2",
    userId: "3",
    userName: "Ana Rodríguez",
    userAvatar: "/placeholder-user.jpg",
    message:
      "Soy diseñadora UX/UI con experiencia en aplicaciones móviles. Me encantaría colaborar en este proyecto porque la sostenibilidad es un tema que me apasiona. Puedo aportar en el diseño de la interfaz, experiencia de usuario y pruebas de usabilidad.",
    skills: ["UX/UI Design", "Figma", "Adobe XD", "Prototyping"],
    appliedAt: "2023-10-21",
    status: "Pendiente",
  },
  {
    id: "3",
    userId: "4",
    userName: "Diego Herrera",
    userAvatar: "/placeholder-user.jpg",
    message:
      "Tengo experiencia en gamificación y desarrollo frontend. Me gustaría colaborar en este proyecto implementando las mecánicas de gamificación para incentivar hábitos sostenibles. También puedo ayudar con la parte de frontend en React Native.",
    skills: ["Gamification", "React Native", "JavaScript", "UI Design"],
    appliedAt: "2023-10-22",
    status: "Pendiente",
  },
]

export default function ProjectApplicationsPage({ params }: { params: { id: string } }) {
  // En una aplicación real, usaríamos params.id para obtener los datos del proyecto y sus solicitudes
  const [applicationStatus, setApplicationStatus] = useState<Record<string, string>>(
    Object.fromEntries(applications.map((app) => [app.id, app.status])),
  )

  const handleAccept = (applicationId: string) => {
    setApplicationStatus((prev) => ({ ...prev, [applicationId]: "Aceptada" }))
    toast({
      title: "Solicitud aceptada",
      description: "Has aceptado la solicitud de colaboración.",
    })
  }

  const handleReject = (applicationId: string) => {
    setApplicationStatus((prev) => ({ ...prev, [applicationId]: "Rechazada" }))
    toast({
      title: "Solicitud rechazada",
      description: "Has rechazado la solicitud de colaboración.",
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
          <Link
            href={`/projects/${params.id}`}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Volver al Proyecto</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solicitudes para {projectData.title}</h1>
            <p className="text-gray-600">Gestiona las solicitudes de colaboración para tu proyecto</p>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="border-0 shadow-lg overflow-hidden">
                <div
                  className={`h-2 ${
                    applicationStatus[application.id] === "Aceptada"
                      ? "bg-emerald-500"
                      : applicationStatus[application.id] === "Rechazada"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                ></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Información del solicitante */}
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-3">
                          <AvatarImage src={application.userAvatar || "/placeholder.svg"} alt={application.userName} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                            {application.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.userName}</h3>
                        <Link
                          href={`/profile/${application.userId}`}
                          className="text-purple-600 hover:text-purple-800 text-sm mb-3"
                        >
                          Ver Perfil
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {new Date(application.appliedAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <Badge
                          className={
                            applicationStatus[application.id] === "Aceptada"
                              ? "bg-emerald-100 text-emerald-700"
                              : applicationStatus[application.id] === "Rechazada"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }
                        >
                          {applicationStatus[application.id]}
                        </Badge>
                      </div>
                    </div>

                    {/* Mensaje y habilidades */}
                    <div className="md:w-2/3 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare size={16} className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium text-gray-700">Mensaje de motivación:</h4>
                        </div>
                        <p className="text-gray-600">{application.message}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Habilidades:</h4>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="border-purple-200 text-purple-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      {applicationStatus[application.id] === "Pendiente" && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => handleAccept(application.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check size={16} className="mr-2" />
                            Aceptar Solicitud
                          </Button>
                          <Button
                            onClick={() => handleReject(application.id)}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X size={16} className="mr-2" />
                            Rechazar Solicitud
                          </Button>
                        </div>
                      )}

                      {applicationStatus[application.id] === "Aceptada" && (
                        <div className="pt-4">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <p className="text-emerald-700 font-medium">
                              ✓ Solicitud aceptada. El colaborador ha sido notificado.
                            </p>
                          </div>
                        </div>
                      )}

                      {applicationStatus[application.id] === "Rechazada" && (
                        <div className="pt-4">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-medium">
                              ✗ Solicitud rechazada. El usuario ha sido notificado.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay solicitudes aún</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Cuando otros estudiantes se postulen para colaborar en tu proyecto, aparecerán aquí.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Link href={`/projects/${params.id}`}>Volver al Proyecto</Link>
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
