"use client";

import { useState } from "react";
import { Check, ChevronDown, FileText } from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { TEMPLATE_SPECS } from "@/lib/agreement-templates";
import { getTemplatesByCategory } from "@/lib/templates";
import { Badge } from "@/components/ui/card";

/**
 * Choosing which of the twenty-four templates the deed is drawn from.
 *
 * The instrument picked at /create only narrows this to four broad families;
 * a warehouse and a shop are both "commercial" but they are not the same
 * document. Picking here swaps in that template's own clauses and its own
 * defaults — 36 months and a warehouse, or 60 months and an ATM lobby — so the
 * rest of the builder starts from the right place instead of from a flat.
 */
export function TemplatePicker() {
  const { draft, setTemplate } = useAgreement();
  const groups = getTemplatesByCategory();
  const current = TEMPLATE_SPECS[draft.templateId];
  // Open by default: a collapsed list meant most people never saw that there
  // were twenty-four templates, and drafted a flat agreement for a warehouse.
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-navy-950">
            <FileText className="size-4 text-brand-700" />
            Which agreement are we drawing?
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-navy-500">
            {current
              ? `Currently drafting the ${current.deedTitle.toLowerCase()} — ${current.defaults.durationMonths} months, ${current.roleA.toLowerCase()} and ${current.roleB.toLowerCase()}.`
              : "Pick the template closest to your situation."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-[13px] font-semibold text-navy-700 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          {open ? "Close" : "Change template"}
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-5 space-y-5">
          {groups.map(({ category, templates }) => (
            <div key={category}>
              <p className="text-[11px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                {category}
              </p>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {templates.map((t) => {
                  const selected = t.id === draft.templateId;
                  const spec = TEMPLATE_SPECS[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      // Stays open after choosing, so the choice can be seen in
                      // the context of what was not chosen.
                      onClick={() => setTemplate(t.id)}
                      aria-pressed={selected}
                      className={
                        selected
                          ? "flex items-start gap-2.5 rounded-xl border-2 border-brand-500 bg-brand-50/60 p-3 text-left"
                          : "flex items-start gap-2.5 rounded-xl border border-line bg-canvas p-3 text-left transition-colors hover:border-brand-300 hover:bg-white"
                      }
                    >
                      <span
                        className={
                          selected
                            ? "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand-600 text-white"
                            : "mt-0.5 size-4 shrink-0 rounded-full border border-line-strong"
                        }
                      >
                        {selected ? <Check className="size-2.5" strokeWidth={4} /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] leading-snug font-semibold text-navy-950">
                          {t.name}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-navy-500">
                          {spec ? `${spec.defaults.durationMonths} months` : t.term}
                          {spec?.clauses.length
                            ? ` · ${spec.clauses.length} extra clause${spec.clauses.length === 1 ? "" : "s"}`
                            : ""}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {current?.notes.length ? (
        <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
          {current.notes.slice(0, 3).map((note) => (
            <li key={note} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-navy-500">
              <Badge tone="brand" className="mt-0.5 shrink-0 px-1.5 py-0 text-[10px]">
                Note
              </Badge>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
