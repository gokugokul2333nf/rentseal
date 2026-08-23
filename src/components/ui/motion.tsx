"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Scroll-triggered reveal. Fires once, respects prefers-reduced-motion via CSS. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its Reveal-like children. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Counts up when scrolled into view. Handles "42,800+", "4.9" and "100%" by
 * animating the numeric part and keeping the affixes intact.
 */
export function Counter({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numeric.replace(/,/g, ""));
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  // Values with no digits at all ("None") have nothing to count — render as-is.
  const countable = Number.isFinite(target);

  useEffect(() => {
    if (!inView || !countable) return;
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = target * eased;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString("en-IN"),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, countable, target, decimals, duration]);

  if (!countable) {
    return (
      <span ref={ref} className={cn("tnum", className)}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Card that tilts subtly toward the cursor. Pointer devices only. */
export function TiltCard({
  children,
  className,
  strength = 6,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(y, { stiffness: 180, damping: 22 });
  const ry = useSpring(x, { stiffness: 180, damping: 22 });

  return (
    <motion.div
      ref={ref}
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px * strength * 2);
        y.set(-py * strength * 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
