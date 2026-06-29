"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      <Link
        href="/"
        className="relative z-10 flex items-center gap-2 group"
      >
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
            <path
              d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
              fill="#1F4FD8"
            />
            <path
              d="M2 11L12 2L22 11"
              stroke="#1F4FD8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight">
          GTA<span className="text-blue-300">Roofing</span>
        </span>
      </Link>

      <div className="relative z-10 flex items-center gap-3">
        <a
          href="tel:+16479196419"
          className="hidden md:flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>(647) 919-6419</span>
        </a>
        <Button
          size="sm"
          className="bg-white text-brand-primary hover:bg-white/90 shadow-lg font-semibold"
          asChild
        >
          <Link href="/estimate">Get Free Estimate</Link>
        </Button>
      </div>
    </motion.nav>
  );
}
