import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Admin — PPDB SDIT Fajar",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <AdminHeader userEmail={user.email || "admin"} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
