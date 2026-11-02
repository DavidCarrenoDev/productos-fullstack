
import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();
