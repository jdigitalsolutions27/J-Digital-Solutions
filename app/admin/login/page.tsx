import { AdminLoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <main id="main-content" tabIndex={-1} className="container-xl flex min-h-screen items-center justify-center py-20 focus:outline-none">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <BrandLogo
            alt="J-Digital Solutions"
            width={210}
            height={62}
            className="mx-auto"
            imageClassName="h-12 w-auto"
            priority
            animated
          />
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-slate-300">Secure access to J-Digital content management.</p>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
