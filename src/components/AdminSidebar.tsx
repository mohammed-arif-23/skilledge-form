'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Menu, X } from 'lucide-react';

interface AdminSidebarProps {
    signOutButton: React.ReactNode;
}

export default function AdminSidebar({ signOutButton }: AdminSidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-30 h-screen shrink-0
                    w-64 bg-white border-r border-gray-200 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo row */}
                <div className="h-16 px-5 border-b border-gray-200 flex items-center justify-between">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={130}
                        height={36}
                        className="object-contain"
                        priority
                    />
                    <button
                        className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        Dashboard
                    </Link>
                </nav>

                {/* Sign out */}
                <div className="px-3 py-4 border-t border-gray-200">
                    {signOutButton}
                </div>
            </aside>

            {/* Mobile top bar — floats on top of content */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-14 px-4 flex items-center gap-3 shadow-sm">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={28}
                    className="object-contain"
                />
            </header>
        </>
    );
}
