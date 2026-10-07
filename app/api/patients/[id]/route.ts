import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";

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
                    message: "Invalid patient ID",
                },
                { status: 400 }
            );
        }

        const patient = await Patient.findById(id);

        if (!patient) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Patient not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error("GET /patients/:id error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch patient",
            },
            { status: 500 }
        );
    }
}