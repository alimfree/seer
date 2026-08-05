import { useState } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

const faqs = [
  {
    question: 'How is this different from hiring an in-house biller?',
    answer: "We combine dedicated billing specialists with software that pre-scrubs every claim against broker and state Medicaid rules before it's ever submitted. You get the accountability of a team plus the consistency of automation, without the overhead of building a full in-house department.",
  },
  {
    question: 'Which brokers and payers do you work with?',
    answer: 'We bill directly through ModivCare, MTM, and most state Medicaid NEMT programs, along with commercial and managed care payers. If you run trips through a broker portal, we can likely bill through it.',
  },
  {
    question: 'Do I need to change my dispatch software?',
    answer: "No. We integrate with the dispatch and trip-logging tools you already use to pull the data we need for clean claim submission.",
  },
  {
    question: 'What happens when a claim is denied?',
    answer: "Every denial is triaged with a documented resolution path — resubmission, appeal, or write-off with an explanation. You get visibility into why claims are denied, not just that they were.",
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No. Month-to-month, cancel anytime. We earn the relationship by keeping your denial rate down and your AR moving.',
  },
  {
    question: 'How secure is my trip and rider data?',
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
