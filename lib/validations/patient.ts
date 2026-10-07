import { z } from "zod";

export const patientSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long"),

    gender: z.enum(["Male", "Female", "Other"]),

    age: z
        .number()
        .int()
        .min(0, "Age cannot be negative")
        .max(120, "Please enter a valid age"),

    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
});

export type PatientInput = z.infer<typeof patientSchema>;