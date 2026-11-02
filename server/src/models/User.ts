
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    nombre: string;
    correo: string;
    passwordHash: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80
        },

        correo: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
