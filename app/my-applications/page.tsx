"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, MessageSquare } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getMySentCollaborationRequests } from "@/src/services/requestService"

// Devuelve las clases de color según el estado de la solicitud
function getStatusColor(status: string) {
  switch ((status || '').toUpperCase()) {
    case 'ACEPTADA':
      return {
        badge: 'bg-emerald-100 text-emerald-700',
        bar: 'bg-emerald-500',
        border: 'border-emerald-200',
      };
    case 'RECHAZADA':
      return {
        badge: 'bg-red-100 text-red-700',
        bar: 'bg-red-500',
        border: 'border-red-200',
      };
    case 'PENDIENTE':
      return {
        badge: 'bg-amber-100 text-amber-700',
        bar: 'bg-amber-500',
        border: 'border-amber-200',
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-700',
        bar: 'bg-gray-400',
        border: 'border-gray-200',
      };
  }
}

export default function MyApplicationsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    setLoading(true)
    getMySentCollaborationRequests()
      .then(res => setRequests(res.data.data || res.data))
      .catch(() => setError("Error al cargar tus solicitudes enviadas."))
      .finally(() => setLoading(false))
  }, [])

  // Filtrado de solicitudes según el filtro seleccionado
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status?.toLowerCase() === filter)

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

          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredRequests.length === 0 ? (
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
          ) : (
          <div className="space-y-6">
              {filteredRequests.map((req) => (
                <Card key={req.id} className="border-0 shadow-lg overflow-hidden">
                <div
                  className={`h-2 ${getStatusColor(req.status).bar}`}
                ></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                          <Link href={`/projects/${req.project?.id}`}>{req.project?.title || "Proyecto eliminado"}</Link>
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                    <Badge
                      className={getStatusColor(req.status).badge}
                    >
                      {req.status}
                    </Badge>
                        </CardDescription>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MessageSquare size={16} className="text-gray-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700">Tu mensaje de solicitud:</h3>
                    </div>
                      <p className="text-gray-600 italic">{req.message || <span className="italic text-gray-400">Sin mensaje</span>}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        Enviada el{" "}
                          {new Date(req.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                        <Link href={`/projects/${req.project?.id}`}>Ver Proyecto</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
