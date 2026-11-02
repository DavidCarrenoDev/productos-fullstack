
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API de Productos funcionando correctamente."
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;
