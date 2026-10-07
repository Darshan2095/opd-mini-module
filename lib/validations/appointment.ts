import { z } from "zod";
import mongoose from "mongoose";

export const appointmentSchema = z.object({
    patientId: z
        .string()
        .min(1, "Patient is required")
        .refine(
            (val) => mongoose.Types.ObjectId.isValid(val),
            "Invalid patient ID format"
        ),

    doctorName: z
        .string()
        .min(2, "Doctor name is required")
        .max(100, "Doctor name is too long"),

    appointmentDate: z
        .string()
        .min(1, "Appointment date and time is required"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;