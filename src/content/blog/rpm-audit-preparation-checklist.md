---
title: "RPM Audit Preparation Checklist: How to Prepare for a Payer Audit"
description: "A practical RPM audit preparation checklist for primary care practices. Know exactly what documentation payers expect and how to organize it."
date: "2026-03-28"
author: "Mohammed Ali"
tags: ["compliance", "billing", "audit"]
image: "/blog/rpm-audit-preparation.webp"
status: "draft"
---

Getting a payer audit letter for your RPM program is not a matter of "if"; it is a matter of "when." As Remote Patient Monitoring adoption accelerates across primary care, commercial payers and Medicare Administrative Contractors (MACs) are increasing claim scrutiny. Practices that cannot produce clean, organized documentation within the audit response window risk repayment demands, extrapolated overpayment calculations, and future prepayment review status.

This checklist is written for practice managers and billing staff at primary care clinics running RPM programs for diabetic patients. It covers what auditors actually look for, how to organize your records before the letter arrives, and the specific steps to take once it does.

## Why RPM Programs Draw Audit Attention

RPM billing is relatively new territory for many payers, and several characteristics make it a natural audit target:

- **Recurring monthly claims:** CPT 99454, 99457, and 99458 generate monthly charges per patient, which means even a small patient panel creates a high claim volume over time.
- **Time-based codes:** 99457 and 99458 require documented clinical staff time, which is one of the most frequently audited claim elements across all specialties.
- **Transmission thresholds:** 99454 requires at least 16 days of device data transmission in a 30-day period. Auditors can request transmission logs to verify this.
- **Consent and setup documentation:** 99453 is a one-time setup code that many practices bill without adequate supporting documentation.

Understanding why your RPM claims are being reviewed helps you anticipate what the auditor will request.

## The RPM Audit Documentation Matrix

Every CPT code in your RPM workflow has specific documentation requirements. The table below maps each code to the records an auditor will expect to see.

| CPT Code | Service | Key Documentation Required |
|----------|---------|---------------------------|
| 99453 | Initial device setup and patient education | Signed patient consent for RPM; date of device provisioning; record of education provided (content, method, staff member); device type and monitored parameter |
| 99454 | Device supply and data transmission (monthly) | Transmission log showing 16+ days of data in the billing period; device serial number or identifier tied to the patient; proof of device assignment |
| 99457 | First 20 minutes of RPM clinical staff time (monthly) | Time log with date, start/stop times, staff name, and credentials; description of clinical activities performed (data review, care coordination, patient contact); cumulative time totaling at least 20 minutes |
| 99458 | Each additional 20 minutes of staff time (monthly) | Same time log format as 99457; cumulative time totaling at least 40 minutes to support one unit of 99458; documentation that this time was distinct and non-overlapping with 99457 |

Print this table and use it as a cross-reference when you run internal audits on your own claims. If any column is missing from a patient's record, that claim is vulnerable.

## Pre-Audit Preparation: What to Do Before the Letter Arrives

The best RPM audit preparation happens long before you receive a request. Build these practices into your monthly workflow.

### Maintain a Consent Log

Keep a centralized record of every patient who has provided informed consent for RPM services. This log should include:

- Patient name and date of birth
- Date consent was obtained
- Method of consent (in-person, telehealth, written form)
- Name of the staff member who obtained consent
- Whether the patient was informed about potential cost-sharing

If your practice uses paper consent forms, scan them and attach them to the patient's chart. Auditors will request these, and you do not want to be searching through filing cabinets under a 30-day response deadline.

### Audit Your Transmission Logs Monthly

Do not wait for a payer to question whether a patient hit 16 days of transmission. Run a monthly report from your RPM platform that shows the number of transmission days per patient per billing period. Flag any patient who fell below the threshold and confirm that no 99454 claim was submitted for that period.

> **Tip:** Create a standing monthly task on your billing calendar to reconcile transmission day counts against submitted 99454 claims. Catching a discrepancy internally costs you a claim adjustment. Having a payer catch it costs you that plus potential extrapolation across your entire RPM panel.

### Standardize Your Time Logs

Time-based codes (99457 and 99458) are where most RPM audits focus. Your clinical staff should be logging their RPM activities with enough detail that a third party can reconstruct what happened.

A defensible time log entry includes:

- **Date of service**
- **Start and stop time** (not just total minutes)
- **Staff name and credential** (RN, MA, LPN, etc.)
- **Activity description:** "Reviewed blood glucose readings and contacted patient to discuss elevated fasting levels" is defensible. "RPM review" is not.
- **Cumulative time for the billing period:** the log should make it obvious when the 20-minute and 40-minute thresholds are crossed.

### Tie Everything to the Patient Chart

Auditors will cross-reference your billing records against the clinical chart. Every RPM service you bill should have a corresponding entry in the patient's medical record. This includes:

- A note documenting the initial setup and education (99453)
- Monthly monitoring notes summarizing what was reviewed and any clinical actions taken
- Records of patient outreach: calls, secure messages, or telehealth contacts triggered by RPM data
- Any care plan modifications made based on monitoring data

If your RPM activities live only in a separate platform and never flow back into the EHR, you have a documentation gap that an auditor will find.

## What to Do When the Audit Letter Arrives

Despite best preparation, receiving the actual letter creates urgency. Follow these steps in order.

### Step 1: Read the Letter Carefully

Audit requests vary. Some ask for records on specific patients and dates of service. Others request a sample of claims within a date range. Note the following:

- **Response deadline:** typically 30 to 45 days; mark it on your calendar immediately.
- **Specific claims or patients listed:** pull these charts first.
- **Requested documentation format:** some payers want electronic submission through a portal; others accept faxed or mailed records.
- **Contact information for the audit team:** if anything in the request is unclear, call and clarify before you start compiling records.

### Step 2: Pull and Organize Records by Patient

For each patient or claim in the audit request, assemble a packet that includes:

1. Signed consent form
2. Device setup and education documentation (99453)
3. Transmission log for the relevant billing period(s) (99454)
4. Time logs for clinical staff RPM activities (99457/99458)
5. Corresponding clinical chart notes
6. Any care plan updates or physician orders related to RPM

Organize each packet with a cover sheet listing the patient identifier, dates of service, and CPT codes billed. Make the auditor's job easy; a well-organized response signals a well-run program.

### Step 3: Identify and Address Gaps Honestly

If you find claims that lack supporting documentation, you have two choices:

- **Locate the missing documentation:** it may exist in a different system, a paper file, or a staff member's notes that were never entered into the chart.
- **Acknowledge the gap:** if documentation genuinely does not exist, do not fabricate it. Voluntarily refunding unsupported claims during an audit is far less damaging than having the auditor flag them and triggering an expanded review.

### Step 4: Submit and Track

Send the response before the deadline, retain a copy of everything you submitted, and note the date and method of submission. If you do not receive confirmation of receipt within a week, follow up.

## Common Audit Pitfalls in RPM Programs

These are the issues that most frequently lead to adverse audit findings for primary care RPM programs:

- **Consent forms missing or undated:** the auditor cannot confirm the patient authorized the service.
- **Transmission days below 16 but 99454 was billed:** this is a straightforward overpayment finding.
- **Time logs with no activity detail:** "RPM, 25 min" does not meet documentation standards for 99457.
- **No distinction between 99457 and 99458 time:** if the log does not clearly show when 20 minutes was reached and when the additional 20-minute increment began, the 99458 claim is unsupported.
- **RPM services billed during an inpatient stay** — RPM is not billable while the patient is admitted to a hospital or skilled nursing facility. Check admission/discharge records against your billing dates.
- **No supervising physician order** — some payers require a physician order initiating RPM services. Verify your payer contracts.

## Building a Sustainable Compliance Workflow

RPM audit preparation should not be a scramble. The practices that pass audits cleanly are the ones that treat documentation as part of the clinical workflow rather than an afterthought.

If your team is managing RPM documentation manually — spreadsheets for time tracking, separate folders for consent forms, manual transmission log pulls — the risk of gaps grows with every patient you add to the program. Platforms like [Zayd Health](https://www.zaydhealth.com) automate the compliance layer of RPM billing, consolidating consent tracking, transmission monitoring, time logging, and audit-ready report generation into a single workflow so your staff can focus on patient care instead of paperwork.

## Next Steps

Take these actions this week to improve your RPM audit readiness:

1. **Run an internal audit on 5 patient charts.** Select patients at random from your active RPM panel. For each one, verify that you can produce every document listed in the audit documentation matrix above. Note any gaps.
2. **Standardize your time log template.** If your clinical staff are not recording start/stop times, activity descriptions, and credentials on every RPM interaction, update the template now and train the team on it.
3. **Reconcile last month's transmission data against billed 99454 claims.** Confirm that every patient you billed for met the 16-day threshold. Correct any claims that did not.
4. **Centralize your consent records.** If signed consent forms are scattered across paper files, scan them and attach them to the corresponding patient charts in your EHR this week.
5. **Designate an audit response owner.** Decide now who on your team will lead the response if an audit letter arrives. That person should know where every piece of RPM documentation lives and have authority to pull records from all systems involved.

RPM audit preparation is not complex, but it requires consistency. The checklist above gives you a concrete starting point. Build it into your monthly operations, and when the audit letter does arrive, you will be ready.
