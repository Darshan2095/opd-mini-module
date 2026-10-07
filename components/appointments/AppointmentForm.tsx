"use client";

import { FormEvent, useEffect, useState } from "react";
import { Patient } from "@/types";

interface AppointmentFormProps {
    onSuccess: () => void;
}

interface FormState {
    patientId: string;
    doctorName: string;
    appointmentDate: string;
}

const INITIAL_FORM: FormState = {
    patientId: "",
    doctorName: "",
    appointmentDate: "",
};

export default function AppointmentForm({ onSuccess }: AppointmentFormProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    const [loading, setLoading] = useState(false);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("/api/patients");
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setPatients(result.data);
                }
            } catch (error) {
                console.error("Failed to load patients list:", error);
            } finally {
                setPatientsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = result.message || "Failed to schedule appointment.";
                if (result.errors) {
                    const messages = Object.values(result.errors).flat();
                    if (messages.length > 0) {
                        errorMsg = messages.join(". ");
                    }
                }
                throw new Error(errorMsg);
            }

            setFeedback({
                type: "success",
                message: "Appointment successfully scheduled into today's queue.",
            });
            setForm(INITIAL_FORM);
            onSuccess();
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            {/* Card Header */}
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                    Schedule Appointment
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Assign an existing patient to an attending doctor and queue slot.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Status / Alert Banner */}
                {feedback && (
                    <div
                        role="alert"
                        className={`rounded-md p-3 text-xs leading-relaxed border ${feedback.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-rose-200 bg-rose-50 text-rose-800"
                            }`}
                    >
                        {feedback.message}
                    </div>
                )}

                {/* Patient Selection */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="patientId"
                            className="text-xs font-medium text-slate-700"
                        >
                            Patient Name <span className="text-rose-500">*</span>
                        </label>
                        {patientsLoading && (
                            <span className="text-[11px] text-slate-400">Loading directory...</span>
                        )}
                    </div>
                    <select
                        id="patientId"
                        name="patientId"
                        value={form.patientId}
                        onChange={handleChange}
                        required
                        disabled={patientsLoading || loading}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        <option value="">
                            {patientsLoading ? "Fetching registered patients..." : "— Select patient record —"}
                        </option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.name} ({patient.phone}) • {patient.gender}, {patient.age}y
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doctor Assigned */}
                <div>
                    <label
                        htmlFor="doctorName"
                        className="block mb-1.5 text-xs font-medium text-slate-700"
                    >
                        Attending Doctor <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="doctorName"
                        type="text"
                        name="doctorName"
                        value={form.doctorName}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Rajesh Patel"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                    />
                </div>

                {/* Date & Time Slot */}
                <div>
                    <label
                        htmlFor="appointmentDate"
                        className="block mb-1.5 text-xs font-medium text-slate-700"
                    >
                        Appointment Slot <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="appointmentDate"
                        type="datetime-local"
                        name="appointmentDate"
                        value={form.appointmentDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || patientsLoading}
                        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading ? "Registering Appointment..." : "Confirm & Schedule Appointment"}
                    </button>
                </div>
            </form>
        </div>
    );
}