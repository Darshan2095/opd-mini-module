"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConsultationHistory from "@/components/consultations/ConsultationHistory";

interface Patient {
    _id?: string;
    name: string;
    gender: string;
    age: number;
    phone: string;
}

interface PatientHistoryClientProps {
    patientId: string;
}

export default function PatientHistoryClient({
    patientId,
}: PatientHistoryClientProps) {
    const router = useRouter();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/patients/${patientId}`);
                const result = await response.json();

                if (result.success && result.data) {
                    setPatient(result.data);
                } else {
                    setError(result.message || "Failed to load patient record.");
                }
            } catch (err) {
                setError("Network error while retrieving patient record.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchPatient();
        }
    }, [patientId]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8 animate-pulse">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="mb-4 h-4 w-24 rounded bg-slate-200" />
                    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-5 w-48 rounded bg-slate-200" />
                                <div className="h-3 w-32 rounded bg-slate-100" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xs">
                        <div className="h-4 w-40 rounded bg-slate-200 mb-4" />
                        <div className="h-32 rounded bg-slate-100" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !patient) {
        return (
            <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-12 px-4">
                <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 font-semibold text-sm border border-rose-100">
                        !
                    </div>
                    <h2 className="mt-3 text-sm font-semibold text-slate-900">
                        Patient Record Unavailable
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        {error || "Could not retrieve clinical profile for this patient ID."}
                    </p>
                    <div className="mt-5">
                        <button
                            onClick={() => router.push("/patients")}
                            className="inline-flex rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                        >
                            Return to Patient Directory
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                {/* Navigation Breadcrumb */}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition group-hover:-translate-x-0.5"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Directory
                    </button>
                </div>

                {/* Patient Demographics Master Header */}
                <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-base font-semibold text-slate-700">
                                {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                                        {patient.name}
                                    </h1>
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                        OPD Record
                                    </span>
                                </div>
                                <p className="mt-0.5 font-mono text-xs text-slate-500">
                                    MRN / ID: {patientId}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/appointments"
                                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-slate-800 transition"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>

                    {/* Quick Demographics Strip */}
                    <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50/50 sm:grid-cols-3">
                        <div className="px-5 py-3">
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                Gender
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-slate-800">
                                {patient.gender}
                            </span>
                        </div>

                        <div className="px-5 py-3">
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                Age
                            </span>
                            <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-800 tabular-nums">
                                {patient.age} Years
                            </span>
                        </div>

                        <div className="col-span-2 border-t border-slate-100 px-5 py-3 sm:col-span-1 sm:border-t-0">
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                Contact Phone
                            </span>
                            <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-800 tabular-nums">
                                +91 {patient.phone}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Longitudinal Encounter Timeline Card */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                                    Consultation & Encounter Records
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Full clinical history, captured vitals, and physician sign-offs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <ConsultationHistory patientId={patientId} />
                    </div>
                </div>
            </div>
        </main>
    );
}