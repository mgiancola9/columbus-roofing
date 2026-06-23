"use client";

import { motion } from "framer-motion";
import { Shield, Zap, CheckCircle2, Clock, MapPin } from "lucide-react";

const stats = [
  { value: "60 sec", label: "To your free estimate", icon: Clock },
  { value: "Instant", label: "Speed-to-lead matching", icon: Zap },
  { value: "10 Cities", label: "Served across the GTA", icon: MapPin },
  { value: "$0", label: "Always free for homeowners", icon: CheckCircle2 },
];

const certifications = [
  { icon: Zap, title: "Speed-to-Lead", desc: "The moment you request your estimate, a local roofer is notified instantly — no waiting days for a callback." },
  { icon: MapPin, title: "Matched to Your Area", desc: "We connect you with a roofer who actually works your neighbourhood — matched by your postal code, not a random call centre." },
  { icon: Shield, title: "Licensed & Insured", desc: "We only work with roofers who carry proper provincial licensing and liability insurance. No exceptions." },
];

export default function TrustSection() {
  return (
    <section className="py-24 md:py-32 bg-brand-text overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden mb-20"
        >
          {stats.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-brand-text flex flex-col items-center justify-center py-10 px-6 text-center"
            >
              <Icon className="w-6 h-6 text-white/40 mb-3" />
              <div className="text-4xl font-black text-white leading-none mb-2">{value}</div>
              <div className="text-white/50 text-sm font-medium">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Every Contractor is Vetted.
            <br />
            <span className="text-blue-300">No Exceptions.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We only connect you with licensed, insured, local roofing professionals across the GTA.
          </p>
        </motion.div>

        {/* Certification cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
