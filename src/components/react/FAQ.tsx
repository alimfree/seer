import { useState } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

const faqs = [
  {
    question: 'How is this different from a regular answering service or IVR?',
    answer: "A generic answering service takes a message. Seer holds a real conversation: it verifies pickup and drop-off addresses, confirms mobility needs, quotes rates, and books the ride directly into your dispatch system, no callback required.",
  },
  {
    question: 'Do I need to change my dispatch software?',
    answer: 'No. Seer integrates with MediRoutes, RouteGenie, TripSpark, RoutingBox, and VectorCare, or connects to any system via a custom webhook. Setup typically takes under 15 minutes.',
  },
  {
    question: 'What happens when a call needs a human?',
    answer: "For complex edge cases, Seer executes a live warm transfer to your dispatcher with a voice summary and screen-pop context card, so your team never starts a call cold.",
  },
  {
    question: 'Can it handle rides for after-hours only, or my full call line?',
    answer: "Both. Start with after-hours and overflow coverage on the Starter plan, or route your full call line to Seer for 24/7 dispatch on the Pro plan.",
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No. Month-to-month, cancel anytime. Every plan starts with a 14-day free pilot so you can see real call volume before committing.',
  },
  {
    question: 'How secure is my caller and rider data?',
    answer: 'HIPAA-compliant handling of rider PHI with encrypted data storage and strict access controls.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3" role="list">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-sm overflow-hidden ghost-border shadow-sm"
            role="listitem"
          >
            <button
              className="w-full px-6 sm:px-8 py-5 sm:py-6 flex justify-between items-center text-left hover:bg-surface-bright transition-colors duration-200"
              onClick={() => { if (!isOpen) trackEvent('faq_open', { question: faq.question }); setOpenIndex(isOpen ? null : i) }}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
            >
              <span className="font-medium text-base sm:text-lg text-on-surface">{faq.question}</span>
              <span className={`material-symbols-outlined text-outline faq-icon ${isOpen ? 'open' : ''}`}>
                expand_more
              </span>
            </button>
            <div
              id={`faq-answer-${i}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              role="region"
              {...(!isOpen ? { inert: true } : {})}
            >
              <div className="px-6 sm:px-8 pb-5 sm:pb-6 text-on-surface-variant">
                {faq.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
