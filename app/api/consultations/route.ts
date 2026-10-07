import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Consultation from "@/models/Consultation";
import Appointment from "@/models/Appointment";
import { consultationSchema } from "@/lib/validations/consultation";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const validation = consultationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            appointmentId,
            vitals,
            notes,
        } = validation.data;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid appointment ID format",
                },
                { status: 400 }
            );
        }

        const appointment =
            await Appointment.findById(appointmentId);

        if (!appointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Appointment not found",
                },
                { status: 404 }
            );
        }

        if (appointment.status === "Completed") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Appointment is already completed",
                },
                { status: 400 }
            );
        }

        const existingConsultation =
            await Consultation.findOne({ appointmentId });

        if (existingConsultation) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Consultation already exists",
                },
                { status: 400 }
            );
        }

        const consultation = await Consultation.create({
            appointmentId,
            patientId: appointment.patientId,
            vitals,
            notes,
            status: "Completed",
            completedAt: new Date(),
        });

        appointment.status = "Completed";
        await appointment.save();

        const populatedConsultation =
            await Consultation.findById(
                consultation._id
            )
                .populate(
                    "patientId",
                    "name gender age phone"
                )
                .populate(
                    "appointmentId",
                    "doctorName appointmentDate status"
                );

        return NextResponse.json(
            {
                success: true,
                message: "Consultation completed successfully",
                data: populatedConsultation,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "POST /consultations error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to complete consultation",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const patientId =
            request.nextUrl.searchParams.get("patientId");

        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid Patient ID is required",
                },
                { status: 400 }
            );
        }

        const consultations =
            await Consultation.find({
                patientId,
                status: "Completed",
            })
                .populate(
                    "appointmentId",
                    "doctorName appointmentDate status"
                )
                .sort({ completedAt: -1 });

        return NextResponse.json({
            success: true,
            data: consultations,
        });
    } catch (error) {
        console.error(
            "GET /consultations error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch consultation history",
            },
            { status: 500 }
        );
    }
}