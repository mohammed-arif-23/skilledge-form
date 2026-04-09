import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, FileText } from "lucide-react";
import { deleteSession } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // If not logged in, we let the login page render its own thing independently
    // Wait, layout wraps login page too! So let's check pathname?
    // It's better to make /admin/login skip the sidebar.
    // We can't check pathname in layout cleanly without headers, so we should put login outside or just render children if !session.

    if (!session) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-gray-200 flex items-center justify-center">
                    <Image src="/logo.png" alt="Logo" width={150} height={40} className="object-contain" priority />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <form action={async () => {
                        'use server';
                        await deleteSession();
                        redirect('/login');
                    }}>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
