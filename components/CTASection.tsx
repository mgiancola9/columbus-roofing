"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Free · No Obligation · Takes 60 Seconds
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-brand-text tracking-tight leading-tight mb-6">
            Ready to Find Out
            <br />
            <span className="text-brand-primary">What Your Roof Costs?</span>
          </h2>

          <p className="text-brand-text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join 500+ GTA homeowners who got their honest estimate here — no
            surprise markups, no hidden fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" className="group w-full sm:w-auto text-base font-bold" asChild>
              <Link href="/estimate">
                Start My Free Estimate
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-brand-text-secondary">
            Your estimate appears immediately — we show the price{" "}
            <span className="font-semibold text-brand-text">before</span> asking for any personal info.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
