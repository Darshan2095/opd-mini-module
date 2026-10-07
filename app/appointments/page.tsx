"use client";

import { useEffect, useState } from "react";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";

export default function AppointmentsPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [todayFormatted, setTodayFormatted] = useState("");

    useEffect(() => {
        setTodayFormatted(
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        );
    }, []);

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleManualRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Top Operational Bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                                Outpatient Scheduling & Queue
                            </h1>
                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                                Desk Mode
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Manage patient admission slots and live consultation progress for{" "}
                            <span className="font-medium text-slate-700">{todayFormatted}</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleManualRefresh}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-[0.98]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-slate-500"
                            >
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 21h5v-5" />
                            </svg>
                            Refresh Queue
                        </button>
                    </div>
                </div>

                {/* Master-Detail Workstation Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
                    <aside className="w-full">
                        <AppointmentForm onSuccess={handleSuccess} />
                    </aside>

                    <section className="w-full">
                        <AppointmentList refreshKey={refreshKey} />
                    </section>
                </div>
            </div>
        </main>
    );
}