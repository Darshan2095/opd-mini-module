import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
    name: string;
    gender: "Male" | "Female" | "Other";
    age: number;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        age: {
            type: Number,
            required: true,
            min: 0,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Patient: Model<IPatient> =
    mongoose.models.Patient ||
    mongoose.model<IPatient>("Patient", PatientSchema);

export default Patient;