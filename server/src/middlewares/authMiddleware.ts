
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware: RequestHandler = (req, res, next) => {
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            res.status(500).json({
                success: false,
                message: "Configuración de autenticación no disponible."
            });
            return;
        }

        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Token de acceso requerido."
            });
            return;
        }

        const token = authorization.slice(7);

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token no proporcionado."
            });
            return;
        }

        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.sub !== "string"
        ) {
            res.status(401).json({
                success: false,
                message: "Token inválido."
            });
            return;
        }

        req.user = {
            userId: decoded.sub
        };

        next();

    } catch {
        res.status(401).json({
            success: false,
            message: "Token inválido o expirado."
        });
    }
};
