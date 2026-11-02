# Productos - Aplicación Full-Stack

## Descripción

Este proyecto consiste en una aplicación web para gestionar productos. Fue desarrollado como parte de la PA3 del curso, con el objetivo de poner en práctica los conocimientos de desarrollo Full-Stack.

La aplicación permite crear una cuenta, iniciar sesión y gestionar productos desde una interfaz web. Cada usuario puede administrar sus propios productos.

## Funcionalidades

- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Encriptación de contraseñas con bcrypt.
- Registro de productos.
- Listado de productos del usuario autenticado.
- Eliminación de productos.
- Protección de endpoints mediante middleware.
- Validación de datos en el backend.

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken

## Estructura del proyecto

```text
productos-fullstack/
├── client/
│   └── src/
│       ├── services/
│       ├── types/
│       ├── App.tsx
│       ├── App.css
│       └── index.css
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── types/
│       ├── app.ts
│       └── index.ts
├── .gitignore
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm.
- Una base de datos MongoDB, local o en MongoDB Atlas.
- Git.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd productos-fullstack
```

### 2. Configurar el backend

```bash
cd server
npm install
```

Crear un archivo `.env` dentro de `server/` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_largo_y_aleatorio
```

### 3. Ejecutar el backend

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

Para comprobar que funciona, visitar:

```text
http://localhost:3000/api/health
```

### 4. Configurar el frontend

En otra terminal:

```bash
cd client
npm install
```

Crear un archivo `.env` dentro de `client/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Ejecutar el frontend

```bash
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador, normalmente:

```text
http://localhost:5173
```

## Endpoints de la API

| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/health` | Verificar el estado de la API | No |
| POST | `/api/auth/register` | Registrar un usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/products` | Listar productos propios | Sí |
| POST | `/api/products` | Crear un producto | Sí |
| DELETE | `/api/products/:id` | Eliminar un producto propio | Sí |

Los endpoints protegidos requieren enviar el token JWT en el encabezado:

```http
Authorization: Bearer <TOKEN>
```

## Capturas de pantalla

Agregar aquí capturas de la aplicación:

- Registro de usuario.
- Inicio de sesión.
- Panel principal.
- Registro de productos.
- Listado de productos.

## Autor

David Carreño

Proyecto académico desarrollado para la PA3.
