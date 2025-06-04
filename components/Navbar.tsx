"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, FileText } from "lucide-react"
import { useAuth } from "@/src/context/AuthContext"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PH</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ProyectaLia Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-purple-600 font-medium hover:text-purple-700 transition-colors"
                  : "text-gray-600 hover:text-purple-600 transition-colors"
              }
            >
              Explorar Proyectos
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/create-project"
                  className={
                    pathname.startsWith("/create-project")
                      ? "text-purple-600 font-medium hover:text-purple-700 transition-colors"
                      : "text-gray-600 hover:text-purple-600 transition-colors"
                  }
                >
                  Crear Proyecto
                </Link>
                <Link
                  href="/my-projects"
                  className={
                    pathname.startsWith("/my-projects")
                      ? "text-purple-600 font-medium hover:text-purple-700 transition-colors"
                      : "text-gray-600 hover:text-purple-600 transition-colors"
                  }
                >
                  Mis Proyectos
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "Usuario"} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : "US"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push(`/profile/${user?.id || "me"}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Ver Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/profile/edit`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Editar Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/my-applications`)}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Mis Solicitudes</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      router.push("/login")
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600" onClick={() => router.push("/login")}>Iniciar Sesión</Button>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" onClick={() => router.push("/register")}>Registrarse</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 