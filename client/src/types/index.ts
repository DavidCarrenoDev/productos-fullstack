export interface User {
    id: string;
    nombre: string;
    correo: string;
}

export interface Product {
    _id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    usuarioId: string;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export interface ProductsResponse {
    success: boolean;
    total: number;
    products: Product[];
}