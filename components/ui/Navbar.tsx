"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { name: "Dashboard", href: "/" },
    { name: "Patients", href: "/patients" },
    { name: "Appointments", href: "/appointments" },
];

export default function Navbar() {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Brand / Clinic Identification */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-slate-900 transition hover:opacity-90"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded border border-blue-600/20 bg-blue-50 text-blue-600 font-semibold text-xs tracking-wider">
                            OPD
                        </span>
                        <span className="font-semibold text-sm tracking-tight text-slate-900">
                            ClinicDesk
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-1">
                        {navigationItems.map((item) => {
                            const active = isLinkActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active
                                            ? "bg-slate-100 text-slate-900 font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    {item.name}
                                    {active && (
                                        <span className="sr-only">(current page)</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Section: System Badge / Quick Context */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        OPD Station Active
                    </div>

                    <Link
                        href="/appointments"
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    >
                        Today's Queue
                    </Link>
                </div>
            </div>
        </header>
    );
}