"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Appointment {
    _id: string;
    doctorName: string;
    appointmentDate: string;
    status: string;
    patientId: {
        _id: string;
        name: string;
        gender: string;
        age: number;
        phone: string;
    };
}

interface ConsultationClientProps {
    appointmentId: string;
}

export default function ConsultationClient({
    appointmentId,
}: ConsultationClientProps) {
    const router = useRouter();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [form, setForm] = useState({
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        weight: "",
        notes: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await fetch(`/api/appointments/${appointmentId}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Appointment record not found");
                }

                setAppointment(result.data);
            } catch (error) {
                setFeedback({
                    type: "error",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to retrieve appointment context",
                });
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const recordedVitalsCount = [
        form.bloodPressure.trim(),
        form.temperature.trim(),
        form.heartRate.trim(),
        form.weight.trim(),
    ].filter(Boolean).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (recordedVitalsCount < 2) {
            setFeedback({
                type: "error",
                message: "Clinical rule: At least two vitals must be documented.",
            });
            return;
        }

        if (!form.notes.trim()) {
            setFeedback({
                type: "error",
                message: "Clinical consultation notes cannot be empty.",
            });
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/consultations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    appointmentId,
                    vitals: {
                        ...(form.bloodPressure.trim() && {
                            bloodPressure: form.bloodPressure.trim(),
                        }),
                        ...(form.temperature.trim() && {
                            temperature: Number(form.temperature),
                        }),
                        ...(form.heartRate.trim() && {
                            heartRate: Number(form.heartRate),
                        }),
                        ...(form.weight.trim() && {
                            weight: Number(form.weight),
                        }),
                    },
                    notes: form.notes.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = result.message || "Failed to finalize consultation summary.";
                if (result.errors) {
                    const messages = Object.values(result.errors).flat();
                    if (messages.length > 0) errorMsg = messages.join(". ");
                }
                throw new Error(errorMsg);
            }

            setFeedback({
                type: "success",
                message: "Consultation finalized. Updating patient encounter history...",
            });

            setTimeout(() => {
                router.push("/appointments");
            }, 1100);
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred while saving the consultation.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-16">
                <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                    <p className="mt-3 text-xs font-medium text-slate-500">
                        Loading patient clinical encounter...
                    </p>
                </div>
            </main>
        );
    }

    if (!appointment) {
        return (
            <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-10 px-4">
                <div className="mx-auto max-w-xl rounded-lg border border-rose-200 bg-rose-50 p-6 text-center">
                    <h2 className="text-sm font-semibold text-rose-900">
                        Appointment Record Unavailable
                    </h2>
                    <p className="mt-1 text-xs text-rose-700">
                        {feedback?.message || "Could not find the requested appointment in the OPD queue."}
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/appointments"
                            className="inline-flex rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                        >
                            Return to Queue
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (appointment.status === "Completed") {
        return (
            <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-10 px-4">
                <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xs text-center">
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold text-sm">
                        ✓
                    </span>
                    <h2 className="mt-3 text-sm font-semibold text-slate-900">
                        Consultation Already Completed
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        This appointment has been signed off. Encounter records are archived under patient history.
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <Link
                            href="/appointments"
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to Appointments
                        </Link>
                        <Link
                            href={`/patients/${appointment.patientId._id}`}
                            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                        >
                            View Patient History
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                {/* Navigation Breadcrumb / Return */}
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
                        Back to Queue
                    </button>
                </div>

                {/* Patient Identity Strip */}
                <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-sm font-semibold text-slate-700">
                                {appointment.patientId.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                                        {appointment.patientId.name}
                                    </h1>
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                        {appointment.patientId.gender}, {appointment.patientId.age} yrs
                                    </span>
                                </div>
                                <p className="mt-0.5 font-mono text-xs text-slate-500">
                                    Contact: {appointment.patientId.phone}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                            <div className="text-left sm:text-right">
                                <p className="text-[11px] text-slate-400">Attending Specialist</p>
                                <p className="text-xs font-medium text-slate-800">
                                    {appointment.doctorName}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50/50 px-5 py-2.5 text-xs text-slate-600">
                        <span className="font-mono text-[11px] text-slate-500">
                            Appointment ID: {appointment._id}
                        </span>
                        <span className="font-medium text-slate-700 tabular-nums">
                            Slot:{" "}
                            {new Date(appointment.appointmentDate).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </span>
                    </div>
                </div>

                {/* Form Feedback Strip */}
                {feedback && (
                    <div
                        role="alert"
                        className={`mb-6 rounded-md border p-3.5 text-xs leading-relaxed ${feedback.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-rose-200 bg-rose-50 text-rose-800"
                            }`}
                    >
                        {feedback.message}
                    </div>
                )}

                {/* Consultation Charting Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card: Vitals Documentation */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                                    Triage & Vitals
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Capture vital observations (minimum of 2 required to proceed).
                                </p>
                            </div>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${recordedVitalsCount >= 2
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-amber-200 bg-amber-50 text-amber-700"
                                    }`}
                            >
                                {recordedVitalsCount} of 2 vitals recorded
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Blood Pressure */}
                            <div>
                                <label
                                    htmlFor="bloodPressure"
                                    className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                    Blood Pressure
                                </label>
                                <div className="relative">
                                    <input
                                        id="bloodPressure"
                                        type="text"
                                        name="bloodPressure"
                                        value={form.bloodPressure}
                                        onChange={handleChange}
                                        placeholder="120/80"
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-14 text-xs font-medium tabular-nums text-slate-900 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[10px] text-slate-400">
                                        mmHg
                                    </span>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div>
                                <label
                                    htmlFor="temperature"
                                    className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                    Temperature
                                </label>
                                <div className="relative">
                                    <input
                                        id="temperature"
                                        type="number"
                                        step="0.1"
                                        name="temperature"
                                        value={form.temperature}
                                        onChange={handleChange}
                                        placeholder="98.6"
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-xs font-medium tabular-nums text-slate-900 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[10px] text-slate-400">
                                        °F
                                    </span>
                                </div>
                            </div>

                            {/* Heart Rate */}
                            <div>
                                <label
                                    htmlFor="heartRate"
                                    className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                    Heart Rate / Pulse
                                </label>
                                <div className="relative">
                                    <input
                                        id="heartRate"
                                        type="number"
                                        name="heartRate"
                                        value={form.heartRate}
                                        onChange={handleChange}
                                        placeholder="72"
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-12 text-xs font-medium tabular-nums text-slate-900 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[10px] text-slate-400">
                                        bpm
                                    </span>
                                </div>
                            </div>

                            {/* Body Weight */}
                            <div>
                                <label
                                    htmlFor="weight"
                                    className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                    Patient Weight
                                </label>
                                <div className="relative">
                                    <input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        placeholder="68.5"
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-xs font-medium tabular-nums text-slate-900 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[10px] text-slate-400">
                                        kg
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Clinical Findings / Notes */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="border-b border-slate-200 pb-3">
                            <label
                                htmlFor="notes"
                                className="block text-sm font-semibold text-slate-900 tracking-tight"
                            >
                                Clinical Observations & Assessment <span className="text-rose-500">*</span>
                            </label>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Document chief complaints, clinical diagnosis, and immediate treatment or prescription instructions.
                            </p>
                        </div>

                        <div className="mt-4">
                            <textarea
                                id="notes"
                                name="notes"
                                rows={5}
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Document patient assessment, diagnosed conditions, and clinical recommendations..."
                                className="w-full rounded-md border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={saving}
                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition focus-visible:outline-2 focus-visible:outline-slate-900"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || recordedVitalsCount < 2}
                            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {saving ? "Signing & Archiving..." : "Complete & Finalize Consultation"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}