"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  q: string;
  a: string;
  category?: string;
}

export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: readonly AccordionItem[];
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("transition-colors", isOpen && "bg-navy-50/40")}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-start gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className="flex-1 text-[15.5px] leading-snug font-semibold text-navy-950">
                  {item.q}
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-45 border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-white text-navy-500",
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-14 text-[14.5px] leading-[1.75] text-navy-600 sm:px-6 sm:pr-16">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
