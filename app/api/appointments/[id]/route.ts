import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid appointment ID",
                },
                { status: 400 }
            );
        }

        const appointment = await Appointment.findById(id).populate(
            "patientId",
            "name gender age phone"
        );

        if (!appointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Appointment not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        console.error(
            "GET /appointments/:id error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch appointment",
            },
            { status: 500 }
        );
    }
}