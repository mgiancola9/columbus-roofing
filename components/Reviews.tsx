"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    city: "Mississauga",
    rating: 5,
    date: "Oct 2024",
    text: "Got my estimate in under a minute, then had 3 contractors calling me within the same day. Ended up saving $4,000 compared to a quote I got through another service. The whole process was so easy.",
    job: "Full roof replacement",
  },
  {
    name: "James T.",
    city: "Toronto",
    rating: 5,
    date: "Sep 2024",
    text: "I was skeptical about getting an online estimate but it was surprisingly accurate — came in within 8% of the final quote. The contractor they connected me with was professional, clean, and on time.",
    job: "Architectural shingle replacement",
  },
  {
    name: "Priya K.",
    city: "Brampton",
    rating: 5,
    date: "Nov 2024",
    text: "After a storm damaged our roof, I needed quotes fast. GTARoofingEstimates had me connected with a licensed contractor the same afternoon. The repair was done within a week. Highly recommend.",
    job: "Storm damage repair",
  },
  {
    name: "Michael R.",
    city: "Vaughan",
    rating: 5,
    date: "Aug 2024",
    text: "Clean, modern experience. I hate filling out forms and dealing with sales people — this was the opposite. Quick estimate, no pressure, excellent contractor. Our metal roof looks incredible.",
    job: "Metal roof installation",
  },
  {
    name: "Linda C.",
    city: "Oakville",
    rating: 5,
    date: "Jul 2024",
    text: "The estimate was right on the money. I appreciated that they showed me the price BEFORE asking for my info. That built so much trust. The contractor was top-notch.",
    job: "Full tear-off & replacement",
  },
  {
    name: "David W.",
    city: "Markham",
    rating: 5,
    date: "Oct 2024",
    text: "Quick, easy, no nonsense. Got 3 quotes, picked the best one, job is done. Our roof is watertight heading into winter. The online estimate was within $500 of the actual job cost.",
    job: "Asphalt shingle replacement",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-brand-gold text-brand-gold" : "text-brand-border"}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
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
            Real Homeowners
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight mb-4">
            Don&apos;t Take Our Word For It
          </h2>
          <div className="flex items-center justify-center gap-2">
            <StarRating rating={5} />
            <span className="text-brand-text font-semibold">4.9 out of 5</span>
            <span className="text-brand-text-secondary">· 500+ Google Reviews</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-brand-card border border-brand-border rounded-2xl p-7 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-xs text-brand-text-secondary mt-1.5 font-medium">{review.job}</p>
                </div>
                <Quote className="w-6 h-6 text-brand-border flex-shrink-0" />
              </div>
              <p className="text-brand-text text-sm leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <div>
                  <div className="text-brand-text font-semibold text-sm">{review.name}</div>
                  <div className="text-brand-text-secondary text-xs">{review.city}</div>
                </div>
                <span className="text-brand-text-secondary text-xs">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
