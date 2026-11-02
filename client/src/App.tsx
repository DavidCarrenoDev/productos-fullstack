import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { User, Product } from "./types";

import {
  registerUser,
  loginUser,
  getProducts,
  createProduct,
  deleteProduct
} from "./services/api";

import "./App.css";

type AuthMode = "login" | "register";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? (JSON.parse(savedUser) as User) : null;
  });

  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [products, setProducts] = useState<Product[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // CARGAR PRODUCTOS (Efecto directo para evitar renders en cascada)
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await getProducts(token);
        if (isMounted) {
          setProducts(response.products);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los productos."
          );
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // REGISTRO E INICIO DE SESIÓN
  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response =
        authMode === "register"
          ? await registerUser(nombre, correo, password)
          : await loginUser(correo, password);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);

      setNombre("");
      setCorreo("");
      setPassword("");

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo completar la operación."
      );
    } finally {
      setLoading(false);
    }
  };

  // CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setProducts([]);
    setMessage("");
    setError("");
  };

  // REGISTRAR PRODUCTO
  const handleCreateProduct = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await createProduct(token, {
        nombre: productName,
        descripcion: description,
        precio: Number(price),
        stock: Number(stock)
      });

      setProducts((previous) => [
        response.product,
        ...previous
      ]);

      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el producto."
      );
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR PRODUCTO
  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await deleteProduct(token, productId);

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId)
      );

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el producto."
      );
    }
  };

  // PANTALLA DE AUTENTICACIÓN
  if (!token || !user) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <div className="brand">
            <span className="brand-icon">P</span>
            <span>Productos</span>
          </div>

          <h1>
            {authMode === "login"
              ? "Bienvenido"
              : "Crear una cuenta"}
          </h1>

          <p className="subtitle">
            {authMode === "login"
              ? "Ingresa tus credenciales para continuar."
              : "Regístrate para comenzar a gestionar tus productos."}
          </p>

          <form onSubmit={handleAuth}>
            {authMode === "register" && (
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>

                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>

              <input
                id="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            {error && <p className="alert error">{error}</p>}
            {message && <p className="alert success">{message}</p>}

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : authMode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-switch">
            {authMode === "login"
              ? "¿No tienes una cuenta?"
              : "¿Ya tienes una cuenta?"}

            <button
              type="button"
              onClick={() => {
                setAuthMode(
                  authMode === "login" ? "register" : "login"
                );

                setError("");
                setMessage("");
              }}
            >
              {authMode === "login"
                ? "Regístrate"
                : "Inicia sesión"}
            </button>
          </p>
        </section>
      </main>
    );
  }

  // PANEL PRINCIPAL
  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">P</span>
          <span>Productos</span>
        </div>

        <div className="user-section">
          <span>Hola, {user.nombre}</span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PANEL PRINCIPAL</p>
            <h1>Gestión de productos</h1>
            <p className="subtitle">
              Administra y controla tus productos desde un solo lugar.
            </p>
          </div>

          <div className="product-counter">
            <strong>{products.length}</strong>
            <span>Productos registrados</span>
          </div>
        </div>

        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert success">{message}</p>}

        <section className="content-grid">
          <div className="panel">
            <h2>Registrar producto</h2>

            <p className="panel-description">
              Completa los datos para agregar un nuevo producto.
            </p>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label htmlFor="productName">Nombre</label>

                <input
                  id="productName"
                  type="text"
                  placeholder="Ej. Laptop Lenovo"
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>

                <textarea
                  id="description"
                  placeholder="Descripción del producto"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  maxLength={500}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Precio</label>

                  <input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>

                  <input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Registrar producto"}
              </button>
            </form>
          </div>

          <div className="panel products-panel">
            <div className="panel-heading">
              <div>
                <h2>Mis productos</h2>
                <p className="panel-description">
                  Productos registrados en tu cuenta.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="empty-state">Cargando productos...</p>
            ) : products.length === 0 ? (
              <p className="empty-state">
                Todavía no tienes productos registrados.
              </p>
            ) : (
              <div className="product-list">
                {products.map((product) => (
                  <article
                    className="product-item"
                    key={product._id}
                  >
                    <div className="product-info">
                      <h3>{product.nombre}</h3>

                      <p>
                        {product.descripcion || "Sin descripción"}
                      </p>

                      <div className="product-details">
                        <span>
                          S/ {product.precio.toFixed(2)}
                        </span>

                        <span>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProduct(product._id)
                      }
                      aria-label={`Eliminar ${product.nombre}`}
                    >
                      Eliminar
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;