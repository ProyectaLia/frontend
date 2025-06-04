# ProyectaLia Hub – Frontend

Bienvenido al frontend de **ProyectaLia Hub**, una plataforma para conectar estudiantes y fomentar la colaboración en proyectos innovadores.

## 🚀 Tecnologías principales

- **Next.js (App Router)** – SSR/SSG y estructura moderna
- **React 18** – Componentes y hooks
- **TypeScript** – Tipado estático y seguridad
- **Tailwind CSS** – Utilidades para estilos rápidos y responsivos
- **shadcn/ui** – Componentes UI accesibles y personalizables
- **Radix UI** – Accesibilidad y primitives para menús, selects, etc.
- **Lucide Icons** – Iconografía moderna
- **Axios** – Llamadas HTTP a la API backend

## 📁 Estructura principal

```
frontend/
  app/                # Rutas y páginas Next.js (App Router)
  components/         # Componentes reutilizables (UI, Navbar, etc.)
  hooks/              # Custom hooks (fetch, lógica compartida)
  lib/                # Utilidades y constantes (áreas, skills, helpers)
  public/             # Imágenes y archivos estáticos
  src/                # Contextos, servicios, middlewares
  styles/             # Tailwind y estilos globales
  ...
```

## 🛠️ Scripts útiles

- `pnpm dev` – Inicia el servidor de desarrollo
- `pnpm build` – Compila la app para producción
- `pnpm start` – Sirve la app compilada
- `pnpm lint` – Linting de código

> **Requisitos:** Node.js 20+, pnpm (o npm/yarn), conexión al backend (ver `.env`)

## 🌟 Buenas prácticas

- **Tipado estricto:** Usa TypeScript en todos los componentes y hooks.
- **Componentes reutilizables:** Usa y extiende los de `components/ui` y shadcn/ui.
- **Hooks personalizados:** Centraliza lógica de fetch y estado en `hooks/`.
- **Estilos:** Prefiere clases de Tailwind y variantes utilitarias.
- **Accesibilidad:** Usa componentes Radix/shadcn para menús, selects, etc.
- **UX:** Feedback visual en botones, menús y estados de carga/error.
- **DRY:** Utiliza utilidades y constantes centralizadas (`lib/profileUtils.ts`).

## 🧩 Integración backend

- El frontend espera un backend Node/Express (ver carpeta `backend/`).
- Configura la URL base de la API en `.env` si es necesario.

## 🤝 Contribuir

1. Haz fork y crea una rama descriptiva.
2. Sigue la guía de estilos y buenas prácticas del repo.
3. Haz PRs pequeños y enfocados.

---

¿Dudas o sugerencias? ¡Abre un issue o contacta al equipo! 