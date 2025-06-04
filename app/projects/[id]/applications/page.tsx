"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { getProjectCollaborationRequests, updateCollaborationRequestStatus } from "@/src/services/requestService"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Check, X, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { stringToArray, AREAS, SKILLS } from "@/lib/profileUtils"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingMessage from "@/components/ui/LoadingMessage"

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

export default function ProjectApplicationsPage() {
  const params = useParams()
  const projectId = params?.id as string
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Estado local para el status de cada solicitud (para feedback inmediato)
  const [applicationStatus, setApplicationStatus] = useState<Record<string, string>>({})

  const fetchRequests = useCallback(() => {
    setLoading(true)
    getProjectCollaborationRequests(projectId)
      .then(res => {
        const data = res.data.data || res.data
        setRequests(data)
        // Inicializa el estado local de status
        setApplicationStatus(Object.fromEntries((data || []).map((app: any) => [app.id, app.status])))
      })
      .catch(() => setError("Error al cargar las solicitudes."))
      .finally(() => setLoading(false))
  }, [projectId])

  useEffect(() => {
    if (projectId) fetchRequests()
  }, [projectId, fetchRequests])

  const handleAccept = async (applicationId: string) => {
    try {
      await updateCollaborationRequestStatus(applicationId, "ACEPTADA")
    setApplicationStatus((prev) => ({ ...prev, [applicationId]: "Aceptada" }))
      toast({ title: "Solicitud aceptada", description: "Has aceptado la solicitud de colaboración." })
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Error al aceptar la solicitud.", variant: "destructive" })
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      await updateCollaborationRequestStatus(applicationId, "RECHAZADA")
    setApplicationStatus((prev) => ({ ...prev, [applicationId]: "Rechazada" }))
      toast({ title: "Solicitud rechazada", description: "Has rechazado la solicitud de colaboración." })
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Error al rechazar la solicitud.", variant: "destructive" })
    }
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
              href={`/projects/${projectId}`}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Volver al Proyecto</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
              <h1 className="text-3xl font-bold text-gray-900">Solicitudes para tu Proyecto</h1>
            <p className="text-gray-600">Gestiona las solicitudes de colaboración para tu proyecto</p>
          </div>
        </div>

          {loading ? (
            <LoadingMessage message="Cargando..." />
          ) : error ? (
            <ErrorMessage description={error} className="max-w-lg mx-auto mt-12" />
          ) : requests.length > 0 ? (
          <div className="space-y-6">
              {requests.map((application: any) => (
              <Card key={application.id} className="border-0 shadow-lg overflow-hidden">
                <div
                  className={`h-2 ${getStatusColor(applicationStatus[application.id]).bar}`}
                ></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-3">
                            <AvatarImage src={application.applicant?.avatar || "/placeholder.svg"} alt={application.applicant?.name || "Usuario"} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                              {(application.applicant?.name || "U").split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.applicant?.name || "Usuario eliminado"}</h3>
                        <Link
                            href={`/profile/${application.applicant?.id}`}
                          className="text-purple-600 hover:text-purple-800 text-sm mb-3"
                        >
                          Ver Perfil
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar size={16} className="mr-2" />
                          <span>
                              {new Date(application.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <Badge
                          className={getStatusColor(applicationStatus[application.id]).badge}
                        >
                          {applicationStatus[application.id]}
                        </Badge>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare size={16} className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium text-gray-700">Mensaje de motivación:</h4>
                        </div>
                          <p className="text-gray-600">{application.message || <span className="italic text-gray-400">Sin mensaje</span>}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Habilidades:</h4>
                        <div className="flex flex-wrap gap-2">
                            {stringToArray(application.applicant?.skills || "").map((skill: string) => (
                            <Badge key={skill} variant="outline" className="border-purple-200 text-purple-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                        {applicationStatus[application.id] === "PENDIENTE" || applicationStatus[application.id] === "Pendiente" ? (
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
                        ) : null}

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
                <Link href={`/projects/${projectId}`}>Volver al Proyecto</Link>
            </Button>
          </div>
        )}
      </main>

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
