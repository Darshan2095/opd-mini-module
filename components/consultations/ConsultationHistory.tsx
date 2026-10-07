"use client";

import { useEffect, useState } from "react";

interface Consultation {
    _id: string;
    vitals: {
        bloodPressure?: string;
        temperature?: number;
        heartRate?: number;
        weight?: number;
    };
    notes: string;
    completedAt: string;
    appointmentId: {
        doctorName: string;
        appointmentDate: string;
    };
}

interface ConsultationHistoryProps {
    patientId: string;
}

export default function ConsultationHistory({
    patientId,
}: ConsultationHistoryProps) {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/consultations?patientId=${patientId}`
                );
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setConsultations(result.data);
                }
            } catch (error) {
                console.error("Failed to load clinical encounter history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchHistory();
        }
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                <p className="mt-2.5 text-xs font-medium text-slate-500">
                    Retrieving longitudinal clinical notes...
                </p>
            </div>
        );
    }

    if (consultations.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-slate-200 py-10 px-4 text-center">
                <p className="text-xs font-medium text-slate-700">
                    No prior completed encounters on file
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                    Consultation records will appear here automatically once an appointment is signed off.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {consultations.map((consultation, index) => {
                const encounterNumber = consultations.length - index;

                return (
                    <div
                        key={consultation._id}
                        className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs transition-colors hover:border-slate-300"
                    >
                        {/* Header: Encounter Doctor & Timestamp */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 font-mono text-[11px] font-semibold text-slate-600">
                                    #{encounterNumber}
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
                                        {consultation.appointmentId?.doctorName || "Attending Physician"}
                                    </h3>
                                    <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                                        Completed:{" "}
                                        {new Date(consultation.completedAt).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Signed Consultation
                            </span>
                        </div>

                        {/* Vitals Summary Strip */}
                        <div className="mt-3.5">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-2">
                                Recorded Vitals
                            </p>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {consultation.vitals.bloodPressure && (
                                    <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
                                        <span className="block text-[10px] text-slate-500 font-medium">
                                            Blood Pressure
                                        </span>
                                        <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-900">
                                            {consultation.vitals.bloodPressure}{" "}
                                            <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                                        </span>
                                    </div>
                                )}

                                {consultation.vitals.temperature && (
                                    <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
                                        <span className="block text-[10px] text-slate-500 font-medium">
                                            Temperature
                                        </span>
                                        <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-900">
                                            {consultation.vitals.temperature}{" "}
                                            <span className="text-[10px] font-normal text-slate-400">°F</span>
                                        </span>
                                    </div>
                                )}

                                {consultation.vitals.heartRate && (
                                    <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
                                        <span className="block text-[10px] text-slate-500 font-medium">
                                            Heart Rate
                                        </span>
                                        <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-900">
                                            {consultation.vitals.heartRate}{" "}
                                            <span className="text-[10px] font-normal text-slate-400">bpm</span>
                                        </span>
                                    </div>
                                )}

                                {consultation.vitals.weight && (
                                    <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
                                        <span className="block text-[10px] text-slate-500 font-medium">
                                            Patient Weight
                                        </span>
                                        <span className="mt-0.5 block font-mono text-xs font-semibold text-slate-900">
                                            {consultation.vitals.weight}{" "}
                                            <span className="text-[10px] font-normal text-slate-400">kg</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assessment & Clinical Notes */}
                        <div className="mt-3.5 border-t border-slate-100 pt-3">
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                                Clinical Assessment & Notes
                            </span>
                            <p className="whitespace-pre-line rounded-md border-l-2 border-slate-300 bg-slate-50/50 p-2.5 text-xs leading-relaxed text-slate-800">
                                {consultation.notes}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}