import { format } from "date-fns";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteAdminUserAction, changePasswordAction, createAdminUserAction } from "@/lib/actions/admin";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminUsersPage() {
  const session = await getServerAuthSession();
  const currentUserId = session?.user?.id || null;
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Users" description="Manage admin users and update your current account password." />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActionForm action={changePasswordAction} submitLabel="Update Password" className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-4 font-semibold text-white">Change Your Password</h2>
          <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" name="currentPassword" type="password" required /></div>
          <div className="mt-4 space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" name="newPassword" type="password" required minLength={10} /></div>
          <div className="mt-4 space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" required minLength={10} /></div>
        </ActionForm>

        <ActionForm action={createAdminUserAction} submitLabel="Create Admin User" resetOnSuccess className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-4 font-semibold text-white">Add New Admin</h2>
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" placeholder="Admin Name" /></div>
          <div className="mt-4 space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
          <div className="mt-4 space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={10} /></div>
        </ActionForm>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Admin Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "Admin"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{format(user.createdAt, "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {currentUserId !== user.id ? (
                      <ActionButton
                        action={deleteAdminUserAction}
                        label="Delete"
                        pendingLabel="Deleting..."
                        variant="destructive"
                        payload={{ id: user.id }}
                        confirmMessage={`Delete admin ${user.email}? This cannot be undone.`}
                      />
                    ) : null}
                  </div>
                  {currentUserId === user.id ? <p className="mt-2 text-xs text-slate-400">This is your current account.</p> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
