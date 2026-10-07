"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Patient } from "@/types";

interface PatientListProps {
    refreshKey: number;
}

export default function PatientList({ refreshKey }: PatientListProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPatients = async (searchValue = "") => {
        try {
            setLoading(true);

            const url = searchValue
                ? `/api/patients?search=${encodeURIComponent(searchValue)}`
                : "/api/patients";

            const response = await fetch(url);
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setPatients(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch patient roster:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [refreshKey]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPatients(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-2xs">
            {/* Table Header & Search Filter */}
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                            Registered Patients Directory
                        </h2>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {patients.length} {patients.length === 1 ? "Record" : "Records"}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Search patient records by legal name or registered telephone number.
                    </p>
                </div>

                {/* Search Input Box */}
                <div className="relative sm:w-72">
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
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                </div>
            </div>

            {/* Main Table View */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                    <p className="mt-2.5 text-xs font-medium text-slate-500">
                        Querying patient index...
                    </p>
                </div>
            ) : patients.length === 0 ? (
                <div className="py-14 text-center">
                    <p className="text-xs font-medium text-slate-700">
                        {search ? `No patients matching "${search}"` : "No registered patients found"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                        {search
                            ? "Verify spelling or search with a 10-digit mobile number."
                            : "Register a new patient using the intake form on the left."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th scope="col" className="px-5 py-3">
                                    Patient Name
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Gender
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Age
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Contact Number
                                </th>
                                <th scope="col" className="px-5 py-3 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-xs">
                            {patients.map((patient) => (
                                <tr
                                    key={patient._id}
                                    className="transition-colors hover:bg-slate-50/75"
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-slate-50 font-mono text-[11px] font-semibold text-slate-700">
                                                {patient.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-900">
                                                {patient.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5 text-slate-600">
                                        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                            {patient.gender}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700">
                                        {patient.age} yrs
                                    </td>

                                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-600">
                                        +91 {patient.phone}
                                    </td>

                                    <td className="px-5 py-3.5 text-right">
                                        <Link
                                            href={`/patients/${patient._id}`}
                                            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition focus-visible:outline-2 focus-visible:outline-slate-900"
                                        >
                                            Medical History
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}