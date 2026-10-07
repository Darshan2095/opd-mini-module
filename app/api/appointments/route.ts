import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { appointmentSchema } from "@/lib/validations/appointment";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const validation = appointmentSchema.safeParse(body);

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

        const { patientId, doctorName, appointmentDate } =
            validation.data;

        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid patient ID format",
                },
                { status: 400 }
            );
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Patient not found",
                },
                { status: 404 }
            );
        }

        const appointment = await Appointment.create({
            patientId,
            doctorName,
            appointmentDate: new Date(appointmentDate),
            status: "Scheduled",
        });

        const populatedAppointment =
            await Appointment.findById(appointment._id).populate(
                "patientId",
                "name gender age phone"
            );

        return NextResponse.json(
            {
                success: true,
                message: "Appointment booked successfully",
                data: populatedAppointment,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /appointments error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to book appointment",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const date = request.nextUrl.searchParams.get("date");

        let query = {};

        if (date === "today") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            query = {
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            };
        }

        const appointments = await Appointment.find(query)
            .populate("patientId", "name gender age phone")
            .sort({ appointmentDate: 1 });

        return NextResponse.json({
            success: true,
            data: appointments,
        });
    } catch (error) {
        console.error("GET /appointments error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch appointments",
            },
            { status: 500 }
        );
    }
}