import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹1,23,456 — Indian digit grouping, no decimals unless asked. */
export function inr(value: number, opts?: { decimals?: boolean; compact?: boolean }) {
  if (!Number.isFinite(value)) return "₹0";
  if (opts?.compact && value >= 100000) {
    const lakhs = value / 100000;
    if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(lakhs % 100 === 0 ? 0 : 1)} Cr`;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts?.decimals ? 2 : 0,
    minimumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(value);
}

/** 12,345 — plain Indian number grouping. */
export function inNum(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

/** "14 March 2026" */
export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "14 Mar 2026" */
export function formatDateShort(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const targetDay = d.getDate();
  d.setMonth(d.getMonth() + months);
  // Clamp for shorter months: 31 Jan + 1 month → 28/29 Feb, not 2/3 Mar.
  if (d.getDate() < targetDay) d.setDate(0);
  return d;
}

/**
 * Rupees to words, Indian system — required on the face of a legal instrument
 * so the figure cannot be altered after signing.
 */
export function numberToWords(num: number): string {
  if (!Number.isFinite(num) || num <= 0) return "Zero";
  const n = Math.floor(num);

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (v: number): string => {
    if (v < 20) return ones[v];
    const t = Math.floor(v / 10);
    const o = v % 10;
    return tens[t] + (o ? ` ${ones[o]}` : "");
  };

  const threeDigits = (v: number): string => {
    const h = Math.floor(v / 100);
    const rest = v % 100;
    const parts: string[] = [];
    if (h) parts.push(`${ones[h]} Hundred`);
    if (rest) parts.push(twoDigits(rest));
    return parts.join(" and ");
  };

  const segments: Array<[number, string]> = [
    [10000000, "Crore"],
    [100000, "Lakh"],
    [1000, "Thousand"],
  ];

  let remaining = n;
  const out: string[] = [];

  for (const [divisor, label] of segments) {
    const q = Math.floor(remaining / divisor);
    if (q > 0) {
      out.push(`${q >= 100 ? threeDigits(q) : twoDigits(q)} ${label}`);
      remaining %= divisor;
    }
  }
  if (remaining > 0) out.push(threeDigits(remaining));

  return out.join(" ").replace(/\s+/g, " ").trim();
}

export function rupeesInWords(num: number) {
  return `Rupees ${numberToWords(num)} Only`;
}

/** Mask an Aadhaar so only the last 4 digits are ever rendered. */
export function maskAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return value;
  return `XXXX XXXX ${digits.slice(-4)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic pastel avatar background derived from a name. */
export function avatarTint(name: string) {
  const palette = [
    "bg-brand-100 text-brand-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}
