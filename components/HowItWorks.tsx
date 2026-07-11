"use client";

import { motion } from "framer-motion";
import { ClipboardList, MapPin, Zap } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Answer A Few Quick Questions",
    description:
      "Tell us your postal code, home size, and roof shape. Takes under a minute.",
    color: "bg-blue-50 text-brand-primary",
  },
  {
    step: "02",
    icon: MapPin,
    title: "Add Your Details",
    description:
      "Drop in your contact info — your postal code tailors the estimate to local rates.",
    color: "bg-green-50 text-brand-success",
  },
  {
    step: "03",
    icon: Zap,
    title: "Estimate + Matched Roofer",
    description:
      "See your price and get instantly connected to a trusted, licensed roofer who works your area.",
    color: "bg-amber-50 text-amber-700",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight">
            Simple. Transparent. Fast.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(33.33%-1px)] right-[calc(33.33%-1px)] h-px bg-brand-border z-0" />

          {steps.map(({ step, icon: Icon, title, description, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-brand-card rounded-2xl border border-brand-border p-8 z-10 group hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-5xl font-black text-brand-border leading-none mt-1">{step}</span>
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-3">{title}</h3>
              <p className="text-brand-text-secondary leading-relaxed text-sm">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
