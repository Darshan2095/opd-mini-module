import { Suspense, use } from "react";
import ConsultationClient from "@/components/consultations/ConsultationClient";

function ConsultationLoadingSkeleton() {
    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/60 py-6 sm:py-8 animate-pulse">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                {/* Breadcrumb Skeleton */}
                <div className="mb-4 h-4 w-28 rounded bg-slate-200" />

                {/* Patient Identity Header Skeleton */}
                <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-40 rounded bg-slate-200" />
                                <div className="h-3 w-28 rounded bg-slate-100" />
                            </div>
                        </div>
                        <div className="h-8 w-32 rounded bg-slate-100 hidden sm:block" />
                    </div>
                    <div className="mt-3 flex justify-between">
                        <div className="h-3 w-36 rounded bg-slate-100" />
                        <div className="h-3 w-28 rounded bg-slate-100" />
                    </div>
                </div>

                {/* Charting Section Skeleton */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
                        <div className="h-4 w-32 rounded bg-slate-200 mb-4" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="h-12 rounded bg-slate-100" />
                            <div className="h-12 rounded bg-slate-100" />
                            <div className="h-12 rounded bg-slate-100" />
                            <div className="h-12 rounded bg-slate-100" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
                        <div className="h-4 w-48 rounded bg-slate-200 mb-4" />
                        <div className="h-28 rounded bg-slate-100" />
                    </div>
                </div>
            </div>
        </main>
    );
}

function ConsultationWrapper({
    paramsPromise,
}: {
    paramsPromise: Promise<{ appointmentId: string }>;
}) {
    const { appointmentId } = use(paramsPromise);
    return <ConsultationClient appointmentId={appointmentId} />;
}

export default function ConsultationPage({
    params,
}: {
    params: Promise<{ appointmentId: string }>;
}) {
    return (
        <Suspense fallback={<ConsultationLoadingSkeleton />}>
            <ConsultationWrapper paramsPromise={params} />
        </Suspense>
    );
}