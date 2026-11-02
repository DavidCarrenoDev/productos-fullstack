
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    usuarioId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        descripcion: {
            type: String,
            trim: true,
            maxlength: 500
        },

        precio: {
            type: Number,
            required: true,
            min: 0.01
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "El stock debe ser un número entero."
            }
        },

        usuarioId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false
    }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
