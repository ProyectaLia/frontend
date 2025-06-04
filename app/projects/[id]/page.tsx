"use client"

import { use, useState, useEffect } from "react"
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
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { getProjectById } from "@/src/services/projectService"
import { useAuth } from "@/src/context/AuthContext"
import { createCollaborationRequest, getMySentCollaborationRequests } from "@/src/services/requestService"

// Utilidad para mostrar el estado en formato legible
function getStatusLabel(status: string) {
  switch (status) {
    case "BUSCANDO_COLABORADORES":
      return "Buscando Colaboradores"
    case "EN_DESARROLLO":
      return "En Desarrollo"
    case "COMPLETADO":
      return "Completado"
    default:
      return status
        ? status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        : "Desconocido"
  }
}

export default function ProjectDetailPage({ params }: { params: Record<string, string> }) {
  const { id } = use(params)
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [applicationMessage, setApplicationMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<{ message: string, type: string }>({ message: "", type: "" });
  const [myRequestForThisProject, setMyRequestForThisProject] = useState<any | null>(null);

  // Consulta si el usuario ya tiene una solicitud para este proyecto
  useEffect(() => {
    if (!user || !project) return;
    getMySentCollaborationRequests().then(res => {
      const requests = res.data.data || res.data || [];
      const found = requests.find((r: any) => r.project?.id === project.id);
      setMyRequestForThisProject(found || null);
    });
  }, [user, project]);

  // Solo puede postular si no es el creador, el proyecto acepta colaboradores y no tiene solicitud previa
  const canApply =
    isAuthenticated &&
    user &&
    project &&
    project.creator &&
    project.creator.id !== user.id &&
    (project.status === "BUSCANDO_COLABORADORES" || project.status === "Buscando Colaboradores") &&
    !myRequestForThisProject;

  // Mensaje si ya postuló
  let alreadyAppliedMsg = "";
  if (myRequestForThisProject) {
    if (myRequestForThisProject.status === "PENDIENTE") {
      alreadyAppliedMsg = "Ya enviaste una solicitud para este proyecto. Está pendiente de revisión.";
    } else if (myRequestForThisProject.status === "ACEPTADA") {
      alreadyAppliedMsg = "¡Ya eres colaborador de este proyecto!";
    } else if (myRequestForThisProject.status === "RECHAZADA") {
      alreadyAppliedMsg = "No puedes volver a postular a este proyecto porque tu solicitud fue rechazada.";
    }
  }

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await getProjectById(id)
        setProject(res.data.data || res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el proyecto.")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProject()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando proyecto...</h3>
        </div>
      </main>
    </div>
  )
  if (error || !project) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error || "Proyecto no encontrado."}</h3>
        </div>
      </main>
    </div>
  )

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationStatus({ message: "", type: "" });
    try {
      await createCollaborationRequest(project.id, applicationMessage);
      setApplicationStatus({ message: "¡Solicitud enviada exitosamente!", type: "success" });
      setShowApplicationForm(false);
      setApplicationMessage("");
      toast({ title: "Solicitud enviada", description: "Tu solicitud fue enviada correctamente." });
      // Actualiza el estado de la solicitud en tiempo real
      const res = await getMySentCollaborationRequests();
      const requests = res.data.data || res.data || [];
      const found = requests.find((r: any) => r.project?.id === project.id);
      setMyRequestForThisProject(found || null);
    } catch (err: any) {
      setApplicationStatus({
        message: err.response?.data?.message || "Error al enviar la solicitud.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />

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
                  variant={getStatusLabel(project.status) === "Buscando Colaboradores" ? "default" : "secondary"}
                  className={
                    getStatusLabel(project.status) === "Buscando Colaboradores"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {project.areaTheme || project.area || "Sin área"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>

              <div className="flex items-center gap-3">
                <Link href={`/profile/${project.creator.id}`} className="flex items-center gap-2 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={project.creator.avatar || "/placeholder.svg"}
                      alt={project.creator.name}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {project.creator.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-purple-600 group-hover:text-purple-800 transition-colors font-medium">
                    {project.creator.name}
                  </span>
                </Link>
                <span className="text-gray-500 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(project.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.isCreator ? (
                <>
                  <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Link href={`/projects/${project.id}/edit`}>
                      <Edit size={16} className="mr-2" />
                      Editar Proyecto
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Link href={`/projects/${project.id}/applications`}>
                      <Users size={16} className="mr-2" />
                      Ver Solicitudes
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {canApply && !showApplicationForm && (
                    <Button onClick={() => setShowApplicationForm(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      Postularme a este Proyecto
                    </Button>
                  )}
                  {showApplicationForm && canApply && (
                    <form onSubmit={handleApply} className="mt-4 space-y-2">
                      <Textarea
                        value={applicationMessage}
                        onChange={e => setApplicationMessage(e.target.value)}
                        placeholder="Mensaje de motivación (opcional)"
                        rows={3}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Enviar</Button>
                        <Button type="button" variant="secondary" onClick={() => setShowApplicationForm(false)}>Cancelar</Button>
                      </div>
                      {applicationStatus.message && (
                        <p className={applicationStatus.type === "error" ? "text-red-600" : "text-green-600"}>
                          {applicationStatus.message}
                        </p>
                      )}
                    </form>
                  )}
                  {!canApply && alreadyAppliedMsg && (
                    <div className="mt-4 text-sm text-gray-600 bg-gray-100 rounded-lg p-3 border border-gray-200">
                      {alreadyAppliedMsg}
                    </div>
                  )}
                </>
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
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivos Principales</h2>
              <ul className="space-y-3">
                {(project.objectives ?? "")
                  .split("\n")
                  .map((objective: string) => objective.trim())
                  .filter(Boolean)
                  .map((objective: string, index: number) => (
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
                        src={project.creator.avatar || "/placeholder.svg"}
                        alt={project.creator.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {project.creator.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{project.creator.name}</p>
                      <p className="text-sm text-purple-600">Líder del Proyecto</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    Creador
                  </Badge>
                </div>

                {project.collaborators.map((collaborator: any) => (
                  <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {collaborator.name
                            .split(" ")
                            .map((n: string) => n[0])
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

                {project.collaboratorsNeeded > 0 && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                    <p className="text-gray-600">
                      <Users size={20} className="inline mr-2 text-gray-400" />
                      Buscando {project.collaboratorsNeeded} colaboradores más
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
                {((project.requiredSkills ?? project.skills ?? '').split(',').map((s: string) => s.trim()).filter(Boolean)).map((skill: string) => (
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
                  <span className="font-medium text-gray-900">{project.areaTheme || project.area || "Sin área"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-gray-900">{getStatusLabel(project.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colaboradores Necesarios:</span>
                  <span className="font-medium text-gray-900">{project.collaboratorsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Publicación:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString("es-ES")}
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
