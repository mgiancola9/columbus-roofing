"use client";

import { motion } from "framer-motion";
import { Shield, Award, CheckCircle2, Users, Clock, MapPin } from "lucide-react";

const stats = [
  { value: "500+", label: "Homeowners Helped", icon: Users },
  { value: "4.9★", label: "Average Rating", icon: Award },
  { value: "24hr", label: "Response Time", icon: Clock },
  { value: "10 Cities", label: "Across the GTA", icon: MapPin },
];

const certifications = [
  { icon: Shield, title: "WSIB Certified", desc: "All partner contractors carry WSIB coverage — protecting you from liability on every job." },
  { icon: Award, title: "BBB Accredited A+", desc: "Every contractor in our network maintains BBB accreditation with an A+ rating." },
  { icon: CheckCircle2, title: "Licensed & Insured", desc: "Provincial licensing and $5M liability insurance required from every contractor we list." },
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
            We only connect you with licensed, insured, and reviewed roofing professionals in the GTA.
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
