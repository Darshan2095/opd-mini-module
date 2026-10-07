import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Consultation from "@/models/Consultation";

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
                    message: "Invalid consultation ID format",
                },
                { status: 400 }
            );
        }

        const consultation =
            await Consultation.findById(id)
                .populate(
                    "patientId",
                    "name gender age phone"
                )
                .populate(
                    "appointmentId",
                    "doctorName appointmentDate status"
                );

        if (!consultation) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Consultation not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: consultation,
        });
    } catch (error) {
        console.error(
            "GET /consultations/:id error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch consultation",
            },
            { status: 500 }
        );
    }
}