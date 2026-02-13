import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CurrentPageIndicator } from "@/components/admin/current-page-indicator";
import { SignOutButton } from "@/components/admin/signout-button";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <>
      <div className="container-xl py-4 lg:hidden">
        <AdminMobileNav />
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="container-xl grid gap-6 pb-8 focus:outline-none lg:grid-cols-[250px,1fr] lg:py-8"
      >
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="space-y-6">
          <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-200">Admin Dashboard</p>
              <CurrentPageIndicator />
              <p className="font-semibold text-white">{session.user.email}</p>
            </div>
            <div className="flex justify-start sm:justify-end">
              <SignOutButton />
            </div>
          </div>
          <div className="surface p-4 sm:p-6">{children}</div>
        </div>
      </main>
    </>
  );
}
