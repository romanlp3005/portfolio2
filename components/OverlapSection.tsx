"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export default function OverlapSection({
  children,
  className = "",
  lift = 140,
}: {
  children: React.ReactNode;
  className?: string;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -lift]);

  return (
    <motion.section ref={ref} style={{ y }} className={className}>
      {children}
    </motion.section>
  );
}
