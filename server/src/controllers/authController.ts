
import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET no está configurada.");
    }

    return jwt.sign(
        { sub: userId },
        secret,
        { expiresIn: "1d" }
    );
};

// REGISTRO DE USUARIOS
export const register: RequestHandler = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (
            typeof nombre !== "string" ||
            typeof correo !== "string" ||
            typeof password !== "string"
        ) {
            res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
            return;
        }

        const normalizedName = nombre.trim();
        const normalizedEmail = correo.trim().toLowerCase();

        if (normalizedName.length < 2 || normalizedName.length > 80) {
            res.status(400).json({
                success: false,
                message: "El nombre debe tener entre 2 y 80 caracteres."
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "El correo electrónico no es válido."
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 8 caracteres."
            });
            return;
        }

        const existingUser = await User.findOne({
            correo: normalizedEmail
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "El correo ya está registrado."
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            nombre: normalizedName,
            correo: normalizedEmail,
            passwordHash
        });

        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente.",
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo
            }
        });

    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            res.status(409).json({
                success: false,
                message: "El correo ya está registrado."
            });
            return;
        }

        console.error("Error en el registro:", error);

        res.status(500).json({
            success: false,
            message: "Error interno al registrar el usuario."
        });
    }
};

// INICIO DE SESIÓN
export const login: RequestHandler = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (
            typeof correo !== "string" ||
            typeof password !== "string" ||
            !correo.trim() ||
            !password
        ) {
            res.status(400).json({
                success: false,
                message: "Correo y contraseña son obligatorios."
            });
            return;
        }

        const normalizedEmail = correo.trim().toLowerCase();

        const user = await User.findOne({
            correo: normalizedEmail
        }).select("+passwordHash");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Credenciales incorrectas."
            });
            return;
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordValid) {
            res.status(401).json({
                success: false,
                message: "Credenciales incorrectas."
            });
            return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso.",
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo
            }
        });

    } catch (error) {
        console.error("Error en el login:", error);

        res.status(500).json({
            success: false,
            message: "Error interno al iniciar sesión."
        });
    }
};
