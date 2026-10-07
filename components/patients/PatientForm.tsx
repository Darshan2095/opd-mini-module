"use client";

import { FormEvent, useState } from "react";

interface PatientFormProps {
    onSuccess: () => void;
}

interface FormState {
    name: string;
    gender: string;
    age: string;
    phone: string;
}

const INITIAL_FORM: FormState = {
    name: "",
    gender: "",
    age: "",
    phone: "",
};

export default function PatientForm({ onSuccess }: PatientFormProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

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
            const response = await fetch("/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    gender: form.gender,
                    age: Number(form.age),
                    phone: form.phone.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = result.message || "Failed to register patient";
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
                message: "Patient registered and directory updated.",
            });

            setForm(INITIAL_FORM);
            onSuccess();
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred during registration.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-xs">
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                    New Patient Admission
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Create a new outpatient demographic record in the clinic directory.
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

                {/* Full Name */}
                <div>
                    <label
                        htmlFor="patientName"
                        className="block mb-1.5 text-xs font-medium text-slate-700"
                    >
                        Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="patientName"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Chandra Patel"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                    />
                </div>

                {/* Gender & Age Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="gender"
                            className="block mb-1.5 text-xs font-medium text-slate-700"
                        >
                            Gender <span className="text-rose-500">*</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="age"
                            className="block mb-1.5 text-xs font-medium text-slate-700"
                        >
                            Age (Years) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            placeholder="e.g. 42"
                            min="0"
                            max="125"
                            required
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 tabular-nums"
                        />
                    </div>
                </div>

                {/* Contact Number */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block mb-1.5 text-xs font-medium text-slate-700"
                    >
                        Contact Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-xs text-slate-400">
                            +91
                        </span>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="98765 43210"
                            maxLength={10}
                            required
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 bg-white pl-11 pr-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 shadow-2xs transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 tabular-nums"
                        />
                    </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading ? "Registering Record..." : "Register Patient"}
                    </button>
                </div>
            </form>
        </div>
    );
}