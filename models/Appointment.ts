import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorName: string;
    appointmentDate: Date;
    status: "Scheduled" | "Completed";
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorName: {
            type: String,
            required: true,
            trim: true,
        },

        appointmentDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Scheduled", "Completed"],
            default: "Scheduled",
        },
    },
    {
        timestamps: true,
    }
);

const Appointment: Model<IAppointment> =
    mongoose.models.Appointment ||
    mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;