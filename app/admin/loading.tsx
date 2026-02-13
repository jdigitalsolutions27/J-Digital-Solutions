import { PageLoader } from "@/components/layout/page-loader";

export default function AdminLoading() {
  return (
    <div className="container-xl py-8">
      <PageLoader label="Loading admin..." />
    </div>
  );
}

