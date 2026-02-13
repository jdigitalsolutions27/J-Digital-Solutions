import { PageLoader } from "@/components/layout/page-loader";

export default function ProtectedAdminLoading() {
  return (
    <div className="container-xl grid gap-6 py-8 lg:grid-cols-[250px,1fr]">
      <div className="surface h-[420px] p-4" />
      <div className="space-y-6">
        <div className="surface p-4">
          <PageLoader label="Loading dashboard..." compact />
        </div>
      </div>
    </div>
  );
}

