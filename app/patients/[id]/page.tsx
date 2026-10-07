import { Suspense, use } from "react";
import PatientHistoryClient from "@/components/patients/PatientHistoryClient";

function PatientHistorySkeleton() {
    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8 animate-pulse">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                {/* Breadcrumb Skeleton */}
                <div className="mb-4 h-4 w-28 rounded bg-slate-200" />

                {/* Demographics Card Skeleton */}
                <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-md bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-44 rounded bg-slate-200" />
                                <div className="h-3 w-28 rounded bg-slate-100" />
                            </div>
                        </div>
                        <div className="h-8 w-32 rounded bg-slate-100 hidden sm:block" />
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50/50 sm:grid-cols-3">
                        <div className="px-5 py-3">
                            <div className="h-3 w-14 rounded bg-slate-200 mb-1.5" />
                            <div className="h-4 w-20 rounded bg-slate-100" />
                        </div>
                        <div className="px-5 py-3">
                            <div className="h-3 w-10 rounded bg-slate-200 mb-1.5" />
                            <div className="h-4 w-16 rounded bg-slate-100" />
                        </div>
                        <div className="col-span-2 border-t border-slate-100 px-5 py-3 sm:col-span-1 sm:border-t-0">
                            <div className="h-3 w-24 rounded bg-slate-200 mb-1.5" />
                            <div className="h-4 w-28 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>

                {/* Consultation Encounters Skeleton */}
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                    <div className="h-4 w-44 rounded bg-slate-200 mb-4" />
                    <div className="h-28 rounded bg-slate-50 border border-slate-100" />
                    <div className="h-28 rounded bg-slate-50 border border-slate-100" />
                </div>
            </div>
        </main>
    );
}

function PatientHistoryWrapper({
    paramsPromise,
}: {
    paramsPromise: Promise<{ id: string }>;
}) {
    const { id } = use(paramsPromise);
    return <PatientHistoryClient patientId={id} />;
}

export default function PatientHistoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<PatientHistorySkeleton />}>
            <PatientHistoryWrapper paramsPromise={params} />
        </Suspense>
    );
}