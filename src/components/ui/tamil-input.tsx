"use client";

import { useState } from "react";
import { Input, Textarea } from "./field";
import { transliterate } from "@/lib/tamil-input";

/**
 * Typing Tamil into an English form.
 *
 * A Tamil deed with an English-only form asks the customer to produce Tamil
 * from somewhere else — their phone's keyboard, or a copy and paste. So when a
 * Tamil template is being drafted these fields accept romanised typing and
 * convert it as it goes: "chennai" becomes சென்னை on the fifth keystroke.
 *
 * The romanised text is kept alongside the Tamil, because the conversion is not
 * reversible — "த" could have come from "tha" or "dha", and re-deriving it on
 * every keystroke would fight the user. Pasting Tamil straight in still works:
 * an edit that is not a simple append or backspace drops the buffer and takes
 * the text as given.
 */
function useTamilTyping(value: string, onChange: (next: string) => void, enabled: boolean) {
  const [roman, setRoman] = useState("");

  return (next: string) => {
    if (!enabled) return onChange(next);

    // Typed at the end — the common case.
    if (next.length > value.length && next.startsWith(value)) {
      const buffer = roman + next.slice(value.length);
      setRoman(buffer);
      return onChange(transliterate(buffer));
    }

    // Backspace at the end. With nothing in the buffer the text came from
    // somewhere else, so it is edited as plain text rather than re-derived —
    // otherwise one backspace would wipe a pasted name.
    if (next.length < value.length && value.startsWith(next)) {
      if (!roman) return onChange(next);
      const buffer = roman.slice(0, -1);
      setRoman(buffer);
      return onChange(transliterate(buffer));
    }

    setRoman("");
    return onChange(next);
  };
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      title={on ? "Tamil typing is on — type as it sounds" : "Type in Tamil"}
      className={
        on
          ? "absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-brand-600 px-2 py-1 text-[11px] font-bold text-white"
          : "absolute top-1/2 right-2 -translate-y-1/2 rounded-lg border border-line px-2 py-1 text-[11px] font-bold text-navy-400 transition-colors hover:text-navy-700"
      }
    >
      அ
    </button>
  );
}

interface Props {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** Whether this deed is in Tamil at all. Off, these behave as plain fields. */
  tamil?: boolean;
  className?: string;
}

export function TamilInput({ id, value, onChange, placeholder, tamil = false, className }: Props) {
  const [on, setOn] = useState(tamil);
  const handle = useTamilTyping(value, onChange, tamil && on);
  if (!tamil) {
    return (
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={(e) => handle(e.target.value)}
        placeholder={on ? "type as it sounds — chennai" : placeholder}
        className={`pr-11 ${className ?? ""}`}
      />
      <Toggle on={on} onClick={() => setOn((v) => !v)} />
    </div>
  );
}

export function TamilTextarea({ id, value, onChange, placeholder, tamil = false, className }: Props) {
  const [on, setOn] = useState(tamil);
  const handle = useTamilTyping(value, onChange, tamil && on);
  if (!tamil) {
    return (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  return (
    <div className="relative">
      <Textarea
        id={id}
        value={value}
        onChange={(e) => handle(e.target.value)}
        placeholder={on ? "type as it sounds — chennai" : placeholder}
        className={`pr-11 ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        title={on ? "Tamil typing is on" : "Type in Tamil"}
        className={
          on
            ? "absolute top-2 right-2 rounded-lg bg-brand-600 px-2 py-1 text-[11px] font-bold text-white"
            : "absolute top-2 right-2 rounded-lg border border-line px-2 py-1 text-[11px] font-bold text-navy-400 transition-colors hover:text-navy-700"
        }
      >
        அ
      </button>
    </div>
  );
}
