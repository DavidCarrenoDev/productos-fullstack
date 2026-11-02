
import type {
    AuthResponse,
    Product,
    ProductsResponse
} from "../types";

// URL base del backend
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("La variable VITE_API_URL no está configurada.");
}

// Función general para realizar peticiones HTTP
const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<T> => {
    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data: unknown = await response.json();

    if (!response.ok) {
        const message =
            typeof data === "object" &&
                data !== null &&
                "message" in data &&
                typeof data.message === "string"
                ? data.message
                : "Ocurrió un error en la solicitud.";

        throw new Error(message);
    }

    return data as T;
};

// REGISTRO DE USUARIO
export const registerUser = (
    nombre: string,
    correo: string,
    password: string
) => {
    return request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            nombre,
            correo,
            password
        })
    });
};

// INICIO DE SESIÓN
export const loginUser = (
    correo: string,
    password: string
) => {
    return request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            correo,
            password
        })
    });
};

// LISTAR PRODUCTOS
export const getProducts = (token: string) => {
    return request<ProductsResponse>(
        "/products",
        {
            method: "GET"
        },
        token
    );
};

// CREAR PRODUCTO
export const createProduct = (
    token: string,
    product: {
        nombre: string;
        descripcion: string;
        precio: number;
        stock: number;
    }
) => {
    return request<{
        success: boolean;
        message: string;
        product: Product;
    }>(
        "/products",
        {
            method: "POST",
            body: JSON.stringify(product)
        },
        token
    );
};

// ELIMINAR PRODUCTO
export const deleteProduct = (
    token: string,
    productId: string
) => {
    return request<{
        success: boolean;
        message: string;
    }>(
        `/products/${productId}`,
        {
            method: "DELETE"
        },
        token
    );
};
