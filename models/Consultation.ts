import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConsultation extends Document {
    appointmentId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    vitals: {
        bloodPressure?: string;
        temperature?: number;
        heartRate?: number;
        weight?: number;
    };
    notes: string;
    status: "Completed";
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
    {
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true,
        },

        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        vitals: {
            bloodPressure: {
                type: String,
                trim: true,
            },

            temperature: {
                type: Number,
            },

            heartRate: {
                type: Number,
            },

            weight: {
                type: Number,
            },
        },

        notes: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        status: {
            type: String,
            enum: ["Completed"],
            default: "Completed",
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Consultation: Model<IConsultation> =
    mongoose.models.Consultation ||
    mongoose.model<IConsultation>(
        "Consultation",
        ConsultationSchema
    );

export default Consultation;