"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, ExternalLink, Github, Linkedin, Twitter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/Navbar"

// Datos de ejemplo para el perfil
const profileData = {
  id: "1",
  name: "Ana Rodríguez",
  career: "Ingeniería en Sistemas Computacionales",
  university: "Universidad Nacional Autónoma",
  bio: "Estudiante de último año apasionada por el desarrollo web y la inteligencia artificial. Busco colaborar en proyectos innovadores que tengan impacto social.",
  skills: ["React", "Node.js", "Python", "Machine Learning", "UI/UX Design", "MongoDB", "Express", "TypeScript", "Git"],
  interests: ["Inteligencia Artificial", "Desarrollo Web", "Aplicaciones Móviles", "Sostenibilidad", "Educación"],
  portfolio: "https://ana-rodriguez.dev",
  github: "https://github.com/ana-rodriguez",
  linkedin: "https://linkedin.com/in/ana-rodriguez",
  twitter: "https://twitter.com/ana_rodriguez",
  projects: [
    {
      id: "1",
      title: "EcoTrack - App de Sostenibilidad",
      description: "Aplicación móvil para rastrear y gamificar hábitos ecológicos en el campus universitario.",
      role: "Líder de Proyecto",
      status: "En Desarrollo",
    },
    {
      id: "2",
      title: "StudyBuddy - Plataforma de Estudio",
      description: "Red social para formar grupos de estudio y compartir recursos académicos entre estudiantes.",
      role: "Desarrolladora Frontend",
      status: "Completado",
    },
  ],
  collaborations: [
    {
      id: "1",
      title: "MindWell - Salud Mental Estudiantil",
      description: "App de bienestar mental con recursos, meditación guiada y conexión con profesionales.",
      role: "UX/UI Designer",
      status: "En Desarrollo",
    },
  ],
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  // En una aplicación real, usaríamos params.id para obtener los datos del perfil
  const isOwnProfile = true // Simulando que es el perfil del usuario actual

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de perfil */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          {/* Cabecera del perfil */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600">
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full p-2"
              >
                <Edit size={20} />
              </Link>
            )}
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="absolute -top-16 flex items-center justify-center">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder-user.jpg" alt={profileData.name} />
                  <AvatarFallback className="text-3xl bg-purple-100 text-purple-600">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-16 md:ml-36 md:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-lg text-gray-600">
                  {profileData.career} • {profileData.university}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {profileData.portfolio && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-1" /> Portfolio
                    </a>
                  </Button>
                )}
                {profileData.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                      <Github size={16} className="mr-1" /> GitHub
                    </a>
                  </Button>
                )}
                {profileData.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={16} className="mr-1" /> LinkedIn
                    </a>
                  </Button>
                )}
                {profileData.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileData.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter size={16} className="mr-1" /> Twitter
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Contactar (visible solo si no es el propio perfil) */}
            {!isOwnProfile && (
              <div className="mt-6">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  <Mail className="mr-2 h-4 w-4" /> Contactar
                </Button>
              </div>
            )}

            {/* Bio */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acerca de</h2>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>

            {/* Habilidades e Intereses */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Áreas de Interés</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos y Colaboraciones */}
        <div className="mt-8">
          <Tabs defaultValue="projects">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="projects">Proyectos Creados</TabsTrigger>
              <TabsTrigger value="collaborations">Colaboraciones</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant={project.status === "En Desarrollo" ? "default" : "secondary"}
                          className={
                            project.status === "En Desarrollo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          {project.role}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        <Link href={`/projects/${project.id}`}>Ver Proyecto</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {profileData.projects.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay proyectos creados</h3>
                  <p className="text-gray-600">Este usuario aún no ha creado ningún proyecto.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="collaborations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.collaborations.map((collab) => (
                  <Card key={collab.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant={collab.status === "En Desarrollo" ? "default" : "secondary"}
                          className={
                            collab.status === "En Desarrollo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {collab.status}
                        </Badge>
                        <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                          {collab.role}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{collab.title}</h3>
                      <p className="text-gray-600 mb-4">{collab.description}</p>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        <Link href={`/projects/${collab.id}`}>Ver Proyecto</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {profileData.collaborations.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay colaboraciones</h3>
                  <p className="text-gray-600">Este usuario aún no ha colaborado en ningún proyecto.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
