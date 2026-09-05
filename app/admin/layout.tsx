import { ReactNode } from "react";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Login page uses the same layout folder — check path via shell
  return <AdminShell isAuthenticated={isAdminAuthenticated()}>{children}</AdminShell>;
}
