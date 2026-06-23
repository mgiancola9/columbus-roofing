"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const oldWay = [
  "Hand over your number before you see a single price",
  "Fill out a form, then wait days for a callback",
  "Get passed to a call centre or an out-of-town crew",
  "Chase contractors who never show up",
];

const ourWay = [
  "See your price first — before you share any details",
  "Matched the instant you're ready, not days later",
  "Connected to a roofer who actually works your area",
  "Licensed, insured, vetted pros — never random",
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            A Smarter Way
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight mb-4">
            Roofing quotes, without the runaround.
          </h2>
          <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">
            Most quote services make you jump through hoops. We flipped it — price
            first, then an instant match to a trusted roofer in your area.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* The usual way */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-brand-card border border-brand-border rounded-2xl p-8"
          >
            <h3 className="text-brand-text-secondary font-bold text-lg mb-6">The usual way</h3>
            <ul className="space-y-4">
              {oldWay.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-brand-text-secondary text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our way */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="bg-brand-primary rounded-2xl p-8 shadow-xl shadow-brand-primary/20"
          >
            <h3 className="text-white font-bold text-lg mb-6">
              With GTARoofing<span className="text-blue-200">Estimates</span>
            </h3>
            <ul className="space-y-4">
              {ourWay.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-sm leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
