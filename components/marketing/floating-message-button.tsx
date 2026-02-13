import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingMessageButton({
  href,
  label = "Message Us"
}: {
  href?: string | null;
  label?: string;
}) {
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-500"
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Link>
  );
}