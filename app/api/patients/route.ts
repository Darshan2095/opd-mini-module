import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";
import { patientSchema } from "@/lib/validations/patient";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const search = request.nextUrl.searchParams.get("search");

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const patients = await Patient.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: patients,
        });
    } catch (error) {
        console.error("GET /patients error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch patients",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const validation = patientSchema.safeParse(body);

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

        const patient = await Patient.create(validation.data);

        return NextResponse.json(
            {
                success: true,
                message: "Patient registered successfully",
                data: patient,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /patients error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to register patient",
            },
            { status: 500 }
        );
    }
}