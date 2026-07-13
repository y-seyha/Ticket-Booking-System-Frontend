"use client";

import { motion } from "framer-motion";

interface ScrollRevealerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollRevealer({
  children,
  className = "",
}: ScrollRevealerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
