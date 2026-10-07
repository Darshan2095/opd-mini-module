"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/types";
import Link from "next/link";

interface AppointmentListProps {
    refreshKey: number;
}

export default function AppointmentList({ refreshKey }: AppointmentListProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/appointments?date=today");
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setAppointments(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [refreshKey]);

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const scheduledCount = appointments.filter(
        (a) => a.status === "Scheduled"
    ).length;

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-xs">
            {/* Header with live count metrics */}
            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                            Today's OPD Queue
                        </h2>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {appointments.length} Total
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Real-time patient check-ins and consultation roster.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50/70 px-2.5 py-1 font-medium text-amber-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {scheduledCount} Waiting
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {appointments.length - scheduledCount} Completed
                    </span>
                </div>
            </div>

            {/* Main Body */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                    <p className="mt-3 text-xs font-medium text-slate-500">
                        Synchronizing queue records...
                    </p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="py-14 text-center">
                    <p className="text-xs font-medium text-slate-700">
                        No consultations registered for today
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                        Use the scheduling form to admit or queue a patient.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th scope="col" className="px-5 py-3 w-16">
                                    Queue #
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Time
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Patient Details
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Attending Doctor
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-5 py-3 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-xs">
                            {appointments.map((appointment, idx) => {
                                const isScheduled = appointment.status === "Scheduled";

                                return (
                                    <tr
                                        key={appointment._id}
                                        className="transition-colors hover:bg-slate-50/75"
                                    >
                                        <td className="px-5 py-3.5 font-mono text-[11px] font-medium text-slate-400">
                                            {String(idx + 1).padStart(2, "0")}
                                        </td>

                                        <td className="px-4 py-3.5 font-medium tabular-nums text-slate-900">
                                            {formatTime(appointment.appointmentDate)}
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-slate-900">
                                                {appointment.patientId?.name || "Unknown Patient"}
                                            </div>
                                            <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                                                {appointment.patientId?.phone || "—"}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5 font-medium text-slate-700">
                                            {appointment.doctorName}
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {isScheduled ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                    Scheduled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Completed
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-3.5 text-right">
                                            {isScheduled ? (
                                                <Link
                                                    href={`/consultations/${appointment._id}`}
                                                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-2xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                                >
                                                    Start Consultation
                                                </Link>
                                            ) : (
                                                <span className="text-[11px] font-medium text-slate-400">
                                                    Closed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}