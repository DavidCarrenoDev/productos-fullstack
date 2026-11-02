import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI no está definida.");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB conectado correctamente.");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        throw error;
    }
};
