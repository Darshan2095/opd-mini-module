import { z } from "zod";
import mongoose from "mongoose";

export const consultationSchema = z
    .object({
        appointmentId: z
            .string()
            .min(1, "Appointment is required")
            .refine(
                (val) => mongoose.Types.ObjectId.isValid(val),
                "Invalid appointment ID format"
            ),

        vitals: z.object({
            bloodPressure: z.string().optional(),
            temperature: z.number().optional(),
            heartRate: z.number().optional(),
            weight: z.number().optional(),
        }),

        notes: z
            .string()
            .min(1, "Consultation notes are required")
            .max(1000, "Notes are too long"),
    })
    .refine(
        (data) => {
            const values = Object.values(data.vitals).filter(
                (value) =>
                    value !== undefined &&
                    value !== null &&
                    value !== ""
            );

            return values.length >= 2;
        },
        {
            message: "At least two vitals are required",
            path: ["vitals"],
        }
    );

export type ConsultationInput = z.infer<
    typeof consultationSchema
>;