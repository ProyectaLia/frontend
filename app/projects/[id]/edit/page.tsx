"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft, Trash2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getProjectById, updateProject, deleteProject } from "@/src/services/projectService"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/src/context/AuthContext"
import { stringToArray, arrayToString, AREAS, SKILLS } from "@/lib/profileUtils"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingMessage from "@/components/ui/LoadingMessage"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string
  const { user, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectives: "",
    area: "",
    collaboratorsNeeded: "1",
  })
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [creatorId, setCreatorId] = useState<number | null>(null)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    getProjectById(projectId)
      .then(res => {
        const p = res.data.data || res.data
        setFormData({
          title: p.title || "",
          description: p.description || "",
          objectives: p.objectives || "",
          area: p.areaTheme || "",
          collaboratorsNeeded: String(p.collaboratorsNeeded ?? 1),
        })
        setSkills(stringToArray(p.requiredSkills ?? p.skills ?? ""))
        setCreatorId(p.creator?.id ?? null)
      })
      .catch(() => setError("No se pudo cargar el proyecto."))
      .finally(() => setLoading(false))
  }, [projectId])

  // Seguridad: solo el creador puede editar
  const isCreator = user && creatorId && Number(user.id) === Number(creatorId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills(prev => [...prev, newSkill])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives,
        requiredSkills: arrayToString(skills),
        areaTheme: formData.area,
        collaboratorsNeeded: Number(formData.collaboratorsNeeded),
      }
      await updateProject(projectId, projectData)
      toast({ title: "Proyecto actualizado", description: "Los cambios se guardaron correctamente." })
      router.push("/my-projects")
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar el proyecto.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    try {
      await deleteProject(projectId)
      toast({ title: "Proyecto eliminado", description: "El proyecto ha sido eliminado." })
      router.push("/my-projects")
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar el proyecto.")
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <LoadingMessage message="Cargando proyecto..." />
    )
  }

  if (!isCreator) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes permiso para editar este proyecto.</h2>
            <Button asChild className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Link href="/my-projects">Volver a Mis Proyectos</Link>
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link href="/my-projects" className="text-purple-600 hover:text-purple-800 mr-3">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
            <Button
              type="button"
              variant="destructive"
              className="ml-auto flex items-center gap-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={18} />
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
          <form onSubmit={handleSubmit}>
            <Card className="mb-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Edita los detalles principales de tu proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Detallada</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objetivos Principales</Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-gray-500">Escribe cada objetivo en una línea separada.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Requisitos y Categorización</CardTitle>
                <CardDescription>Edita las habilidades necesarias y el área temática</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Habilidades Requeridas</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 pl-3 pr-2 py-1.5 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-purple-500 hover:text-purple-700 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Añadir habilidad (ej. React, Python, Diseño UX)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="h-11 rounded-r-none"
                    />
                    <Button type="button" onClick={addSkill} className="rounded-l-none bg-purple-600 hover:bg-purple-700">
                      <Plus size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Agrega o elimina las habilidades que los colaboradores deberían tener para contribuir a tu proyecto.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="area">Área Temática</Label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={e => handleSelectChange("area", e.target.value)}
                      className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                      required
                    >
                      <option value="">Selecciona un área</option>
                      {AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collaboratorsNeeded">Colaboradores Necesarios</Label>
                    <Input
                      id="collaboratorsNeeded"
                      name="collaboratorsNeeded"
                      type="number"
                      min={1}
                      value={formData.collaboratorsNeeded}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {error && <ErrorMessage description={error} className="max-w-lg mx-auto mt-8" />}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={() => router.push("/my-projects")}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  )
} 