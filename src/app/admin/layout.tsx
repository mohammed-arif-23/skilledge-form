import { redirect } from "next/navigation";
import { getSession, deleteSession } from "@/lib/auth";
import { LogOut } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        return <>{children}</>;
    }

    const signOutButton = (
        <form
            action={async () => {
                "use server";
                await deleteSession();
                redirect("/login");
            }}
        >
            <button
                type="submit"
                className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
                <LogOut className="w-5 h-5 shrink-0" />
                Sign out
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar signOutButton={signOutButton} />

            {/* Main content — padded top on mobile for the fixed header */}
            <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
