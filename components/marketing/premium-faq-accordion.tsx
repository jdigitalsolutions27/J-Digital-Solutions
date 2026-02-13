"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/card";
import { fadeIn } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function PremiumFaqAccordion({ items }: { items: FaqItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const reduceMotion = useShouldReduceMotion();

  return (
    <div className="mx-auto grid max-w-4xl gap-4">
      {items.map((item) => {
        const isOpen = activeId === item.id;
        return (
          <Card key={item.id} className="overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => setActiveId(isOpen ? null : item.id)}
            >
              <span className="font-semibold text-white">{item.question}</span>
              <ChevronDown className={`h-4 w-4 text-blue-200 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  exit={reduceMotion ? undefined : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  <div className="px-5 pb-5 text-sm text-slate-300">{item.answer}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
