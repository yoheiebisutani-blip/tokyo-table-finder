"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What happens when my pass expires?",
    a: "Your previously generated messages remain accessible. You just can't generate new ones.",
  },
  {
    q: "Can I upgrade my pass?",
    a: "Yes, you can purchase a longer pass at any time.",
  },
  {
    q: "Is there a refund policy?",
    a: "We offer a full refund within 24 hours of purchase if you haven't generated any messages.",
  },
  {
    q: "Do I need a pass to search restaurants?",
    a: "No, searching and browsing is always free.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-dark-600 rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between text-light-100 font-medium hover:bg-dark-800 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {faq.q}
            <span className="text-light-300 ml-4 shrink-0">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-light-300 text-sm leading-relaxed">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
