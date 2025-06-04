"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, MessageSquare } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"

// Datos de ejemplo para las solicitudes
const applications = [
  {
    id: "1",
    projectId: "3",
    projectTitle: "MindWell - Salud Mental Estudiantil",
    projectCreator: "Diego Herrera",
    creatorAvatar: "/placeholder-user.jpg",
    message:
      "Me interesa mucho este proyecto porque tengo experiencia en diseño UX/UI y me apasiona la salud mental. He trabajado en proyectos similares y creo que puedo aportar mucho al diseño de la interfaz y la experiencia de usuario.",
    status: "Aceptada",
    appliedAt: "2023-10-20",
    respondedAt: "2023-10-22",
  },
  {
    id: "2",
    projectId: "4",
    projectTitle: "CampusFood - Delivery Universitario",
    projectCreator: "Ana Rodríguez",
    creatorAvatar: "/placeholder-user.jpg",
    message:
      "Tengo experiencia en desarrollo con Flutter y me encantaría colaborar en este proyecto. Además, he trabajado en proyectos de e-commerce anteriormente.",
    status: "Pendiente",
    appliedAt: "2023-10-25",
    respondedAt: null,
  },
  {
    id: "3",
    projectId: "5",
    projectTitle: "BiblioTech - Biblioteca Digital Universitaria",
    projectCreator: "Javier Méndez",
    creatorAvatar: "/placeholder-user.jpg",
    message:
      "Me interesa este proyecto porque tengo experiencia en desarrollo web y bases de datos. Me gustaría contribuir en la parte backend del sistema.",
    status: "Rechazada",
    appliedAt: "2023-10-18",
    respondedAt: "2023-10-23",
  },
]

export default function MyApplicationsPage() {
  const [filter, setFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true
    return app.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
              <p className="text-gray-600">Gestiona tus solicitudes para colaborar en proyectos</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "border-purple-200 text-gray-700"
                }
              >
                Todas
              </Button>
              <Button
                variant={filter === "pendiente" ? "default" : "outline"}
                onClick={() => setFilter("pendiente")}
                className={
                  filter === "pendiente" ? "bg-amber-500 hover:bg-amber-600 text-white" : "border-amber-200 text-gray-700"
                }
              >
                Pendientes
              </Button>
              <Button
                variant={filter === "aceptada" ? "default" : "outline"}
                onClick={() => setFilter("aceptada")}
                className={
                  filter === "aceptada"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "border-emerald-200 text-gray-700"
                }
              >
                Aceptadas
              </Button>
              <Button
                variant={filter === "rechazada" ? "default" : "outline"}
                onClick={() => setFilter("rechazada")}
                className={
                  filter === "rechazada" ? "bg-red-500 hover:bg-red-600 text-white" : "border-red-200 text-gray-700"
                }
              >
                Rechazadas
              </Button>
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="border-0 shadow-lg overflow-hidden">
                  <div
                    className={`h-2 ${
                      application.status === "Aceptada"
                        ? "bg-emerald-500"
                        : application.status === "Rechazada"
                          ? "bg-red-500"
                          : "bg-amber-500"
                    }`}
                  ></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                          <Link href={`/projects/${application.projectId}`}>{application.projectTitle}</Link>
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Link href={`/profile/${application.projectCreator}`} className="flex items-center gap-2 group">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={application.creatorAvatar || "/placeholder.svg"}
                                alt={application.projectCreator}
                              />
                              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                {application.projectCreator
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-600 group-hover:text-purple-600 transition-colors">
                              {application.projectCreator}
                            </span>
                          </Link>
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          application.status === "Aceptada"
                            ? "bg-emerald-100 text-emerald-700"
                            : application.status === "Rechazada"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <MessageSquare size={16} className="text-gray-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-700">Tu mensaje de solicitud:</h3>
                      </div>
                      <p className="text-gray-600 italic">{application.message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          Enviada el{" "}
                          {new Date(application.appliedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {application.status === "Pendiente" ? (
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Cancelar Solicitud
                        </Button>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {application.status === "Aceptada" ? "Aceptada" : "Rechazada"} el{" "}
                            {new Date(application.respondedAt!).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        <Link href={`/projects/${application.projectId}`}>Ver Proyecto</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron solicitudes</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filter === "all"
                  ? "Aún no has enviado solicitudes para colaborar en proyectos."
                  : `No tienes solicitudes con estado "${filter}".`}
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Link href="/">Explorar Proyectos</Link>
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
    </ProtectedRoute>
  )
}
