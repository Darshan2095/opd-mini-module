"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
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

    const loadStats = async () => {
      try {
        setLoading(true);
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/appointments?date=today"),
        ]);

        const patients = await patientsResponse.json();
        const appointments = await appointmentsResponse.json();

        if (patients.success && Array.isArray(patients.data)) {
          setPatientCount(patients.data.length);
        } else {
          setPatientCount(0);
        }

        if (appointments.success && Array.isArray(appointments.data)) {
          setAppointmentCount(appointments.data.length);
        } else {
          setAppointmentCount(0);
        }
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top OPD Overview Banner */}
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Outpatient Reception Desk
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live OPD
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Daily census, appointment queuing, and clinical charting oversight for{" "}
              <span className="font-medium text-slate-700">{todayFormatted}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-slate-800 transition"
            >
              Open Live Queue
            </Link>
          </div>
        </div>

        {/* Clinical Statistics Strip */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total Patients Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Registered Patients
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                MRN Directory
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {patientCount ?? 0}
                </span>
              )}
              <span className="text-xs text-slate-500">active records</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Total patient demographic profiles on file.
            </p>
          </div>

          {/* Today's Appointments Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Today&apos;s Appointments
              </span>
              <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-mono text-[10px]">
                Today
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {appointmentCount ?? 0}
                </span>
              )}
              <span className="text-xs text-slate-500">scheduled encounters</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Patients admitted or queued for current physician roster.
            </p>
          </div>
        </div>

        {/* Quick Workstation Actions */}
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workstation Modules
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/patients"
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
                    PT
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Patient Directory & Registration
                  </h3>
                </div>
                <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                Register new outpatients, search records by phone/name, and review longitudinal encounter histories.
              </p>
            </Link>

            <Link
              href="/appointments"
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
                    AP
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Appointment Booking & Queue
                  </h3>
                </div>
                <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                Schedule patient slots, monitor today&apos;s waiting queue, and launch doctor consultation charting.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}