/*
  Pricing FAQ section with static questions and answers.
*/
import React from "react"

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your plan at any time from your account settings. You'll retain access until the end of your billing cycle.",
  },
  {
    question: "What happens when I run out of credits?",
    answer: "Once your credits are exhausted, you can either upgrade your plan or purchase a one-time credit top-up pack from the dashboard.",
  },
  {
    question: "Do you offer discounts for educational use?",
    answer: "Yes, we provide special pricing for students and educators. Please contact our support team with your academic credentials.",
  },
]

export default function Faq() {
  return (
    <section className="mt-16 lg:mt-20">
      <h2 className="text-center text-2xl md:text-3xl font-semibold text-foreground">Frequently Asked Questions</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.35)]">
            <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
