---
title: "Telehealth vs. RPM Billing: Key Differences Every Practice Must Understand"
description: "Understand telehealth vs RPM billing differences including legal distinctions, when you can bill both, originating site rules, and post-PHE requirements."
date: "2025-12-12"
author: "Mohammed Ali"
tags: ["billing", "telehealth", "rpm"]
image: "/blog/telehealth-vs-rpm.webp"
status: "draft"
---

Telehealth and Remote Patient Monitoring are both forms of virtual care, but they are billed under entirely different frameworks. Practices that conflate the two (using telehealth place of service codes on RPM claims, or assuming RPM documentation standards apply to telehealth) end up with denied claims and compliance exposure. Understanding where these programs diverge is essential for any practice offering both services.

This guide breaks down the legal, operational, and billing distinctions between telehealth and RPM, including when you can bill both for the same patient and what has changed since the end of the Public Health Emergency.

## Defining the Difference

Before diving into billing mechanics, it helps to be precise about what each term means from a regulatory standpoint.

**Telehealth** refers to real-time, synchronous audio-video encounters between a patient and a provider. The patient and provider are in different locations, but they interact live. Telehealth visits are billed using standard E/M codes (99202-99215) with telehealth-specific place of service codes and modifiers.

**Remote Patient Monitoring (RPM)** refers to the asynchronous collection and review of physiologic data transmitted from a patient's device to the provider. The patient takes a reading (blood glucose, blood pressure, weight, etc.) at home, the data transmits automatically, and clinical staff review it later. RPM uses its own CPT codes (99453, 99454, 99457, 99458).

The fundamental distinction is synchronous vs. asynchronous. Telehealth is a live visit. RPM is ongoing data collection and periodic review.

| Characteristic | Telehealth | RPM |
|---------------|-----------|-----|
| Interaction type | Synchronous (live audio/video) | Asynchronous (data transmission + later review) |
| CPT codes | E/M codes (99202-99215) | RPM codes (99453, 99454, 99457, 99458) |
| Frequency | Per encounter | Monthly (ongoing) |
| Technology required | Video platform (HIPAA-compliant) | FDA-cleared monitoring device + data platform |
| Patient location requirement | Varies (see below) | Any location (no restriction) |
| Provider-patient relationship | Established or new (varies by state) | Established patients only |

## Legal and Regulatory Framework

Telehealth is governed by state-specific regulations covering provider licensure (you must be licensed where the patient is located), parity laws, prescribing rules, and informed consent requirements. RPM has a simpler framework: no geographic restriction on patient location, no state licensure issue for data review (since it is asynchronous), and no state-by-state variation in consent requirements for Medicare.

> **Key distinction:** A physician in New York can order RPM for a patient who then moves to Florida and continues transmitting data. The same physician cannot provide a telehealth visit to that patient in Florida without a Florida medical license. This makes RPM more geographically flexible than telehealth.

## Place of Service Codes: Where Most Mistakes Happen

Place of service codes are the billing element most commonly confused between telehealth and RPM.

### Telehealth POS Codes

| POS Code | Description | When to Use |
|----------|-------------|-------------|
| 02 | Telehealth provided other than in patient's home | Patient is at a telehealth-equipped facility (clinic, hospital, SNF) |
| 10 | Telehealth provided in patient's home | Patient is at their private residence |

When billing telehealth with POS 02 or 10, you also append modifier 95 (or modifier GT, depending on the payer) to indicate the service was delivered via telehealth.

### RPM POS Codes

| POS Code | Description | When to Use |
|----------|-------------|-------------|
| 11 | Office | RPM device setup (99453) performed in the office |
| 12 | Home | RPM monitoring services (99454, 99457, 99458), patient is at home |

### The Critical Rule

**Never use POS 02 or POS 10 for RPM claims.** RPM is not telehealth. Using telehealth POS codes on RPM claims misrepresents the service and can trigger denials or audits.

**Never use POS 12 for telehealth claims.** POS 12 is for services delivered to the patient at home that are not telehealth encounters: RPM monitoring, home health, etc.

This may seem obvious, but in practice, we see this error frequently. Billing systems that auto-populate POS codes based on "virtual care" templates often assign the wrong code because the system does not distinguish between telehealth and RPM.

## Technology Requirements

The technology requirements for telehealth and RPM are completely different, and confusing them can create both billing and compliance problems.

| Requirement | Telehealth | RPM |
|-------------|-----------|-----|
| HIPAA-compliant video platform | Required | Not required |
| FDA-cleared monitoring device | Not required | Required |
| Real-time interaction capability | Required | Not required |
| Automatic data transmission | Not required | Required |
| Patient internet access | Required (for video) | Required (for data transmission) |
| Audio-only option | Yes (limited codes) | N/A; RPM is data-based, not encounter-based |

## Can You Bill Telehealth and RPM for the Same Patient?

Yes, and this is where revenue optimization comes in. Telehealth and RPM are separate services with separate codes, and there is no CMS prohibition against billing both for the same patient, even on the same day.

### Same-Day Billing

A patient can have a telehealth visit (billed as an E/M with POS 10 and modifier 95) and have RPM services (billed as 99457 with POS 12) on the same day. The key requirements:

1. **The services must be distinct.** The telehealth visit must address clinical issues beyond just reviewing RPM data. If the entire telehealth visit consists of reviewing RPM readings with the patient, you may have a documentation problem.
2. **Time cannot overlap.** The 20 minutes of RPM clinical time (99457) and the telehealth visit time must be separate, non-overlapping time periods.
3. **Documentation must support both.** The telehealth visit note and the RPM activity log must each stand on their own as independent services.

### Same-Month Billing

Billing both services in the same month is straightforward and very common. A diabetic patient might have:

- RPM data transmission throughout the month (99454).
- RPM clinical staff review of blood glucose trends with a phone call to the patient (99457).
- A scheduled telehealth follow-up visit to adjust medications (99214 with POS 10 and modifier 95).

Each of these is a separate, documented service with its own billing code. There is no conflict.

### Revenue Impact of Combined Billing

| Service Combination | Monthly Revenue per Patient (Medicare) |
|--------------------|-----------------------------------------|
| RPM only (99454 + 99457) | $108–$120 |
| Telehealth only (one 99214 visit) | $105–$130 |
| RPM + one telehealth visit | $213–$250 |
| RPM + CCM + one telehealth visit | $275–$314 |

For a practice managing 100 diabetic patients with combined RPM and monthly telehealth check-ins, the additional telehealth revenue layer adds $10,500–$13,000 per month compared to RPM alone.

## Telehealth Rules After the Public Health Emergency

The COVID-19 Public Health Emergency introduced sweeping telehealth flexibilities. Many of those flexibilities have since expired or been modified. Here is the current state as of 2026.

### What Remains in Place

- **Medicare telehealth from home.** Medicare patients can receive telehealth services from their home (POS 10). This was temporary during the PHE but was made permanent through subsequent legislation.
- **Audio-only visits.** Medicare continues to cover audio-only telehealth visits for established patients using codes 99441-99443, though reimbursement is lower than video visits.
- **No originating site facility fee restriction.** During the PHE, patients did not need to be at a qualifying originating site. This flexibility has been extended but check current CMS guidance for the latest status.

### What Has Changed

- **Provider licensure enforcement.** During the PHE, CMS waived certain licensure requirements. Those waivers have expired. Providers must now hold a license in the state where the patient is located.
- **Prescribing via telehealth.** DEA rules around prescribing controlled substances via telehealth without an initial in-person visit have tightened. Check current DEA guidance before prescribing Schedule II-V substances to patients you have only seen via telehealth.
- **Commercial payer policies.** Many commercial payers expanded telehealth coverage during the PHE. Some have since rolled back coverage or reduced reimbursement rates for telehealth visits compared to in-person visits.

### How This Affects RPM

The post-PHE changes primarily affect telehealth, not RPM. RPM was not part of the PHE flexibilities; it existed as a standalone billing category before the pandemic and continues unchanged. The geographic flexibility, POS codes, and documentation requirements for RPM remain the same as they were pre-pandemic.

This stability is one of RPM's operational advantages. While telehealth rules continue to evolve with each legislative cycle, RPM billing rules have been consistent since 2019.

> **Strategic consideration:** If your practice is concerned about further telehealth reimbursement cuts or coverage rollbacks, RPM provides a more stable long-term revenue stream. RPM revenue is less dependent on policy changes because the billing framework is mature and has bipartisan legislative support.

## Common Mistakes When Billing Both

**Mistake 1: Using the telehealth visit to satisfy RPM interactive time**
If a provider conducts a 30-minute telehealth visit and spends 10 minutes of it reviewing RPM data, those 10 minutes cannot also count toward the 20-minute threshold for 99457. The RPM time must be separate from the telehealth visit.

**Mistake 2: Billing RPM setup during a telehealth visit**
CPT 99453 (device setup and patient education) is best billed when performed in person. While there is no explicit CMS prohibition against remote setup, the documentation must support that the patient was properly trained on device use. Remote setup creates additional documentation burden and audit risk.

**Mistake 3: Applying telehealth modifiers to RPM codes**
Modifier 95 and modifier GT are telehealth modifiers. They should never appear on RPM claim lines. This is a quick way to get a claim denied.

**Mistake 4: Double-billing patient communication time**
If you call a patient to discuss an abnormal RPM reading and then transition the conversation to general care management, you need to split the time. The RPM-related portion counts toward 99457. The general care management portion counts toward CCM (if enrolled) or is simply part of clinical care. It cannot all be billed as RPM time.

Running telehealth and RPM together creates meaningful revenue opportunities, but the billing boundaries must be clear. Platforms like [Zayd Health](https://www.zaydhealth.com) help practices maintain clean separation between RPM and other service categories, ensuring that time tracking, documentation, and claim submissions are properly allocated across programs.

The practices that succeed with both programs treat them as complementary but operationally independent. Different codes, different documentation, different workflows, unified only by the shared goal of better outcomes for patients with chronic conditions.
