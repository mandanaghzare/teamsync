import Navbar from "@/components/layout/Navbar";
import Slidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout ({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Slidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}