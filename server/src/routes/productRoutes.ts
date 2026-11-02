
import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getProducts,
    createProduct,
    deleteProduct
} from "../controllers/productController.js";

const router = Router();

// Todas las rutas de productos requieren autenticación
router.use(authMiddleware);

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;
