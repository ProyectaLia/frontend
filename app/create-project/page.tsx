"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const areaOptions = [
  "Tecnología Verde",
  "Educación",
  "Salud y Bienestar",
  "Emprendimiento",
  "Arte y Cultura",
  "Ciencia e Investigación",
  "Desarrollo Social",
  "Innovación Tecnológica",
  "Deportes",
  "Otro",
]

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectives: "",
    area: "",
    collaboratorsNeeded: "1",
  })
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills((prev) => [...prev, newSkill])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para crear el proyecto
    console.log("Creando proyecto:", { ...formData, skills })
    toast({
      title: "Proyecto creado",
      description: "Tu proyecto ha sido publicado correctamente.",
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
              <Link
                href="/create-project"
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
              >
                Crear Proyecto
              </Link>
              <Link href="/my-projects" className="text-gray-600 hover:text-purple-600 transition-colors">
                Mis Proyectos
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <span className="sr-only">Perfil</span>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                  MG
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-purple-600 hover:text-purple-800 mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Publica tu Idea de Proyecto</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Proporciona los detalles principales de tu proyecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Proyecto</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej. EcoTrack - App de Sostenibilidad"
                  className="h-11"
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
                  placeholder="Describe tu proyecto, su propósito, alcance y cualquier otra información relevante..."
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
                  placeholder="Lista los objetivos principales de tu proyecto, uno por línea..."
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
              <CardDescription>Define las habilidades necesarias y categoriza tu proyecto</CardDescription>
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
                  Agrega las habilidades que los colaboradores deberían tener para contribuir a tu proyecto.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area">Área Temática</Label>
                  <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collaboratorsNeeded">Número de Colaboradores Buscados</Label>
                  <Select
                    value={formData.collaboratorsNeeded}
                    onValueChange={(value) => handleSelectChange("collaboratorsNeeded", value)}
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona un número" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Publicar Proyecto
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
  )
}
