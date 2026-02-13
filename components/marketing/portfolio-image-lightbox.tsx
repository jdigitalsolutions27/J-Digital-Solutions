"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

export function PortfolioImageLightbox({
  src,
  alt,
  previewClassName,
  imageClassName
}: {
  src: string;
  alt: string;
  previewClassName?: string;
  imageClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useShouldReduceMotion();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border border-white/15 text-left",
          "bg-[linear-gradient(145deg,rgba(56,189,248,0.12),rgba(255,255,255,0.04),rgba(96,165,250,0.12))]",
          previewClassName
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(186,230,253,0.24),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_80%,rgba(125,211,252,0.2),transparent_50%)]" />
        </div>

        {!reduceMotion ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-12 bg-[radial-gradient(circle,rgba(125,211,252,0.22),transparent_62%)] blur-3xl"
            animate={{ x: [-10, 10, -10], y: [-8, 8, -8], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        ) : null}

        <div className="relative z-10 h-full w-full p-2">
          <div className="relative h-full w-full">
            <Image src={src} alt={alt} fill className={cn("object-contain object-top", imageClassName)} />
          </div>
        </div>

        <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm transition group-hover:bg-white/20">
          <Expand className="h-3.5 w-3.5" />
          View Image
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Image preview for ${alt}`}
          >
            <motion.div
              className="relative h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(145deg,rgba(56,189,248,0.08),rgba(2,6,23,0.62))] p-3"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-20 rounded-full border border-white/25 bg-slate-950/65 p-2 text-white transition hover:bg-slate-900"
                aria-label="Close image preview"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative h-full w-full">
                <Image src={src} alt={alt} fill className="object-contain" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

