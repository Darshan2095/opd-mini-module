"use client";

import { useState } from "react";
import PatientForm from "@/components/patients/PatientForm";
import PatientList from "@/components/patients/PatientList";

export default function PatientsPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleManualRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Top Header & Context Strip */}
                <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                                Patient Index & Admission
                            </h1>
                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                                Directory
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Register new outpatients and inspect medical consultation history records.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleManualRefresh}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-[0.98]"
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
                            Refresh Directory
                        </button>
                    </div>
                </div>

                {/* Master-Detail Workstation Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
                    <aside className="w-full">
                        <PatientForm onSuccess={handleSuccess} />
                    </aside>

                    <section className="w-full">
                        <PatientList refreshKey={refreshKey} />
                    </section>
                </div>
            </div>
        </main>
    );
}