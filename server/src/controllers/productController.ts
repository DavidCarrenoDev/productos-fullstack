import type { RequestHandler } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

// LISTAR PRODUCTOS
export const getProducts: RequestHandler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Usuario no autenticado."
            });
            return;
        }

        const products = await Product.find({
            usuarioId: userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (error) {
        console.error("Error al listar productos:", error);

        res.status(500).json({
            success: false,
            message: "Error al obtener los productos."
        });
    }
};

// CREAR PRODUCTO
export const createProduct: RequestHandler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Usuario no autenticado."
            });
            return;
        }

        const { nombre, descripcion, precio, stock } = req.body;

        if (
            typeof nombre !== "string" ||
            typeof precio !== "number" ||
            typeof stock !== "number"
        ) {
            res.status(400).json({
                success: false,
                message: "Nombre, precio y stock son obligatorios."
            });
            return;
        }

        const normalizedName = nombre.trim();

        if (normalizedName.length < 2 || normalizedName.length > 100) {
            res.status(400).json({
                success: false,
                message: "El nombre debe tener entre 2 y 100 caracteres."
            });
            return;
        }

        if (!Number.isFinite(precio) || precio <= 0) {
            res.status(400).json({
                success: false,
                message: "El precio debe ser mayor que cero."
            });
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            res.status(400).json({
                success: false,
                message: "El stock debe ser un entero igual o mayor que cero."
            });
            return;
        }

        if (
            descripcion !== undefined &&
            (typeof descripcion !== "string" || descripcion.trim().length > 500)
        ) {
            res.status(400).json({
                success: false,
                message: "La descripción no es válida."
            });
            return;
        }

        const product = await Product.create({
            nombre: normalizedName,
            descripcion: descripcion?.trim() || undefined,
            precio,
            stock,
            usuarioId: userId
        });

        res.status(201).json({
            success: true,
            message: "Producto registrado correctamente.",
            product
        });

    } catch (error) {
        console.error("Error al crear producto:", error);

        res.status(500).json({
            success: false,
            message: "Error al registrar el producto."
        });
    }
};

// ELIMINAR PRODUCTO
export const deleteProduct: RequestHandler = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Usuario no autenticado."
            });
            return;
        }

        // Corrección aplicada: Asegurar que id sea un string puro antes de validar
        const productId = Array.isArray(id) ? id[0] : id;

        if (!productId || typeof productId !== "string" || !mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                success: false,
                message: "Identificador de producto inválido."
            });
            return;
        }

        const product = await Product.findOneAndDelete({
            _id: productId,
            usuarioId: userId
        });

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado."
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar producto:", error);

        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto."
        });
    }
};