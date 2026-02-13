import { PageLoader } from "@/components/layout/page-loader";

export default function Loading() {
  return (
    <main className="container-xl py-10 sm:py-12">
      <PageLoader label="Loading page..." />
    </main>
  );
}

