# ⚡ MicroPOS

> El sistema operativo para Clubes Estudiantiles. Gestión de ventas, inventario y métricas, simplificado.

![Status](https://img.shields.io/badge/Status-Development-yellow) ![License](https://img.shields.io/badge/License-MIT-blue) ![Stack](https://img.shields.io/badge/Stack-Astro_React_Supabase-orange)

## 🎯 Misión

Este proyecto, impulsado por el Club **Enigma**, busca digitalizar la economía estudiantil. MicroPOS es una plataforma SaaS (Software as a Service) que permite a cualquier club escolar gestionar sus ventas de comida, merch o eventos sin hojas de cálculo ni libretas perdidas.

## 🚀 Funcionalidades Principales (MVP)

Estamos construyendo la **Versión 1.0** con estas características esenciales:

- **🔐 Autenticación Multi-Club:** Cada club tiene su propia cuenta y datos aislados.
- **📦 Gestión de Inventario:** Altas, bajas y control de stock en tiempo real.
- **🛒 Terminal de Venta (POS):** Interfaz rápida para cobrar productos desde el celular o laptop.
- **📊 Dashboard Financiero:** Gráficas simples de ingresos diarios y semanales.
- **🧾 Tickets Digitales:** Generación de comprobantes simples.

## 🛠️ Tech Stack

Utilizamos tecnologías modernas y tipadas para asegurar calidad y velocidad:

- **Core:** [Astro](https://astro.build/) (SSR & Routing)
- **UI:** [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) (No reinventamos la rueda)
- **Backend & DB:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Estado:** [Zustand](https://github.com/pmndrs/zustand) (Manejo del carrito de compras)
- **Pagos:** Stripe / Lemon Squeezy (Futura integración)
- **Calidad:** Biome + Husky (Linting estricto)

## 💻 Instalación y Setup

Sigue estos pasos para levantar el proyecto localmente:

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/tu-usuario/micropos.git](https://github.com/tu-usuario/micropos.git)
   cd micropos
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Duplica el archivo `.env.example` y renómbralo a `.env`. Pide las llaves de Supabase al Tech Lead.

   ```bash
   cp .env.example .env
   ```

4. **Correr el servidor:**

   ```bash
   npm run dev
   ```

## 🤝 Reglas de Contribución (LEER OBLIGATORIAMENTE)

Para mantener el código limpio, seguimos un protocolo estricto ("Iron Fist Protocol"):

1. **Ramas Protegidas:** No puedes hacer push directo a `main`.
2. **Commits Semánticos:** Usamos [Conventional Commits](https://www.conventionalcommits.org/).
   - ✅ `feat: agregar carrito de compras`
   - ❌ `cambios en el carrito`
3. **Linting Automático:** Husky no te dejará hacer commit si el código tiene errores o mal formato.
4. **Pull Requests:** Todo cambio requiere un PR aprobado por el Owner del proyecto.

---

Construido con ❤️ y mucho café por [Enigma Student Club].
