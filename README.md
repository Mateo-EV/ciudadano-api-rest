# Ciudadano API REST

API REST para la gestión de seguridad ciudadana, permitiendo a los usuarios reportar incidentes y comunicarse con las autoridades locales.

## 🚀 Características

- **Autenticación de usuarios**: Registro y login con verificación por email
- **Gestión de incidentes**: Reporte y seguimiento de incidentes de seguridad
- **Notificaciones por email**: Sistema de verificación y alertas
- **Arquitectura hexagonal**: Código limpio y mantenible

## 🛠️ Tecnologías

- **NestJS**: Framework backend
- **Prisma**: ORM para base de datos
- **TypeScript**: Lenguaje de programación
- **Zod**: Validación de datos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run start:dev
```

## 🏗️ Estructura del Proyecto

- `src/contexts/app/auth`: Módulo de autenticación
- `src/contexts/app/user`: Módulo de usuarios
- `src/contexts/app/incidents`: Módulo de incidentes
- `src/lib`: Librerías compartidas (Prisma, Nodemailer, Zod)

## 📄 Licencia

MIT
