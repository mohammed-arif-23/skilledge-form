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
                <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-[150px] h-[55px]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    <button
                        className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <div className="text-xs font-bold text-[#93AAEF] uppercase tracking-wider mb-4 px-3">Main Menu</div>
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="group relative flex items-center gap-3 px-3 py-3 text-[#1a2d7a] rounded-xl hover:bg-[#F4F6FD] hover:text-[#2B4ECC] transition-all text-[15px] font-bold"
                    >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#2B4ECC] rounded-r-full transition-all group-hover:h-3/4" />
                        <LayoutDashboard className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                        Dashboard
                    </Link>
                </nav>

                {/* Sign out */}
                <div className="px-3 py-4 border-t border-gray-200">
                    {signOutButton}
                </div>
            </aside>

            {/* Mobile top bar — floats on top of content */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100 h-16 px-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 text-gray-600 hover:bg-[#F4F6FD] hover:text-[#2B4ECC] rounded-xl transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="relative w-[130px] h-[35px]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </div>
            </header>
        </>
    );
}
