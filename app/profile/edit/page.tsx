"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/src/context/AuthContext"
import { updateUser } from "@/src/services/authService"
import { useRouter } from "next/navigation"
import { stringToArray, arrayToString, AREAS, SKILLS } from "@/lib/profileUtils"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingMessage from "@/components/ui/LoadingMessage"

export default function EditProfilePage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState(() => ({
    id: user?.id || "",
    name: user?.name || "",
    career: user?.career || "",
    university: user?.university || "",
    bio: user?.bio || "",
    skills: stringToArray(user?.skills),
    interests: stringToArray(user?.interests),
    portfolio: user?.portfolio || user?.portfolioLink || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    twitter: user?.twitter || "",
  }))
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")

  // Sincroniza el formulario si el usuario cambia
  useEffect(() => {
    setFormData({
      id: user?.id || "",
      name: user?.name || "",
      career: user?.career || "",
      university: user?.university || "",
      bio: user?.bio || "",
      skills: stringToArray(user?.skills),
      interests: stringToArray(user?.interests),
      portfolio: user?.portfolio || user?.portfolioLink || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      twitter: user?.twitter || "",
    })
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s: string) => s !== skill) }))
  }

  const addInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, newInterest] }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i: string) => i !== interest) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm("¿Estás seguro de que quieres guardar los cambios en tu perfil?");
    if (!confirmed) return;
    try {
      const res = await updateUser({
        ...formData,
        skills: arrayToString(formData.skills),
        interests: arrayToString(formData.interests),
      });
      // Actualiza el contexto con los datos nuevos
      const token = typeof window !== "undefined" ? localStorage.getItem("proyectalia_token") || "" : "";
      login(res.data.data, token);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente.",
      });
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 1200);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "No se pudo guardar el perfil.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <LoadingMessage message="Cargando perfil..." />
    );
  }

  if (!user) {
    return (
      <ErrorMessage description="No autorizado" className="max-w-lg mx-auto mt-12" />
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/profile/1" className="text-purple-600 hover:text-purple-800 mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información básica y biografía</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt={formData.name} />
                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                      {formData.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                    <Upload size={14} />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Foto de Perfil</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Sube una foto clara donde se vea bien tu rostro. Formatos: JPG, PNG. Máximo 2MB.
                  </p>
                  <div className="flex space-x-3">
                    <Button type="button" size="sm" variant="outline">
                      Cambiar Foto
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera / Programa de Estudios</Label>
                  <Input
                    id="career"
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">Universidad / Institución</Label>
                  <Input
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuéntanos un poco sobre ti, tus intereses académicos y profesionales..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Habilidades y Áreas de Interés</CardTitle>
              <CardDescription>
                Agrega las habilidades que posees y las áreas en las que te gustaría trabajar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Habilidades</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill: string) => (
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
              </div>

              <div className="space-y-4">
                <Label>Áreas de Interés para Proyectos</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.interests.map((interest: string) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 pl-3 pr-2 py-1.5 flex items-center gap-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 text-indigo-500 hover:text-indigo-700 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    placeholder="Añadir área de interés (ej. Inteligencia Artificial, Educación)"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="h-11 rounded-r-none"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="rounded-l-none bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Enlaces y Redes Sociales</CardTitle>
              <CardDescription>Comparte tus perfiles profesionales y portafolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Enlace a Portafolio Personal</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://tuportafolio.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/profile/1">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
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
