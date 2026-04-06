import { useState } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

const faqs = [
  {
    question: 'How does this differ from traditional RPM software?',
    answer: "We track clinician review time to the second — automatically, not self-reported. Our billing engine enforces clean claim rules before export, so your biller never submits a superbill that's missing documentation. Every claim links to a timestamped audit trail that wins appeals.",
  },
  {
    question: 'Do I need to hire more staff?',
    answer: 'No. Our platform is designed to slide into your existing workflow without additional headcount.',
  },
  {
    question: 'What happens during a payer audit?',
    answer: 'Every superbill links to a timestamped audit log with exact session times and staff identity, providing the proof needed to win appeals.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No. Cancel anytime. Active patients only.',
  },
  {
    question: 'How secure is the patient health data?',
    answer: 'HIPAA compliant with encrypted data and PHI separation by design.',
  },
  {
    question: 'What types of patients qualify for RPM?',
    answer: 'Any patient with a chronic condition and a qualifying monitoring device. We focus on diabetic patients because glucose monitoring is well-established and reimbursement rates are strong, but the platform supports any RPM-eligible population.',
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
