"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, Calendar, MessageSquare } from "lucide-react";

const nextSteps = [
  {
    icon: Phone,
    title: "Expect a call within 24 hours",
    desc: "Each of 3 contractors will reach out to schedule a free on-site assessment.",
  },
  {
    icon: Calendar,
    title: "Choose your inspection time",
    desc: "All estimates are free and include a thorough assessment of your roof.",
  },
  {
    icon: MessageSquare,
    title: "Compare & choose",
    desc: "Review all 3 quotes at your own pace — zero pressure to commit.",
  },
];

export default function ThankYou() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-brand-success" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-brand-text tracking-tight mb-3"
      >
        You&apos;re all set!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-brand-text-secondary text-lg mb-10 leading-relaxed"
      >
        We&apos;ve received your request and are matching you with 3 licensed GTA contractors.
        You&apos;ll hear from them within 24 hours.
      </motion.p>

      {/* Next steps */}
      <div className="text-left space-y-4 mb-10">
        {nextSteps.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-start gap-4 bg-brand-bg rounded-xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <div className="font-bold text-brand-text text-sm mb-0.5">{title}</div>
              <div className="text-brand-text-secondary text-sm leading-relaxed">{desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
