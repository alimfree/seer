---
title: "Continuous Glucose Monitoring for RPM: A Primary Care Guide"
description: "How to use continuous glucose monitoring in remote patient monitoring programs: device selection, data interpretation, and billing considerations."
date: "2025-10-20"
author: "Mohammed Ali"
tags: ["clinical", "devices", "diabetes"]
image: "/blog/continuous-glucose-monitoring.webp"
status: "published"
---

Continuous glucose monitoring has transformed diabetes management in specialty care over the past decade. Now, as remote patient monitoring programs expand into primary care, CGM is becoming a practical option for practices that want richer glycemic data than fingerstick meters can provide.

But integrating CGM into an RPM workflow is not the same as prescribing one in an endocrinology office. Primary care teams need to understand the device options, data transmission requirements, clinical interpretation frameworks, and billing nuances before committing to a CGM-based RPM strategy.

This guide walks through each of those areas with the specificity your team needs to make an informed decision.

## CGM vs. Traditional Glucose Meters for RPM

The fundamental difference between CGM and traditional fingerstick meters comes down to data density. A fingerstick meter gives you a single point-in-time reading. A CGM sensor measures interstitial glucose every 1 to 5 minutes, generating up to 288 data points per day.

For RPM purposes, that difference matters in several ways.

| Factor | Fingerstick Meter | Continuous Glucose Monitor |
|--------|-------------------|---------------------------|
| Readings per day | 1–4 (patient-dependent) | 288+ (automatic) |
| Nocturnal data | Rarely captured | Captured continuously |
| Patient burden | High (requires active testing) | Low (passive after insertion) |
| Trend visibility | None | Full trend arrows and graphs |
| Hypoglycemia detection | Only if patient tests at the right time | Real-time alerts |
| Typical device cost | $15–$40/month | $75–$300/month (varies by plan) |
| Data transmission | Via Bluetooth to app or cellular hub | Via Bluetooth to app, then cloud |
| RPM 99454 compliance | Requires patient action daily | Automatic if sensor is active |

For practices focused on diabetic patients with frequent hypoglycemia, high glycemic variability, or poor adherence to fingerstick testing, CGM solves real clinical problems. For stable Type 2 patients on oral medications only, a standard Bluetooth glucose meter may be more cost-effective and simpler to manage.

### When CGM Makes Sense in Primary Care RPM

CGM is not necessary for every diabetic patient in your RPM program. Consider prioritizing CGM for patients who meet one or more of these criteria:

- A1C above 9% despite medication adjustments
- History of severe hypoglycemia or hypoglycemia unawareness
- On insulin therapy (basal, basal-bolus, or pump)
- Poor adherence to fingerstick testing (fewer than 4 readings per week)
- Pregnancy with gestational or pre-existing diabetes
- High glycemic variability visible in prior lab work

> **Clinical Tip:** If a patient is consistently logging fewer than 16 fingerstick readings per month, their data is insufficient for meaningful RPM clinical review. CGM eliminates this adherence barrier entirely because data collection is passive.

## Eligible CGM Devices for RPM Programs

Not every CGM on the market is suitable for RPM. The key requirement is that the device must transmit data electronically to your practice in a way that satisfies CPT 99454. Specifically, the device must collect and transmit data for at least 16 days in a 30-day billing period.

### Device Comparison for RPM Use

| Device | Sensor Duration | Data Access Method | RPM Integration | Real-Time Alerts |
|--------|----------------|-------------------|-----------------|-----------------|
| Dexcom G7 | 10 days | Cloud API (Clarity) | Strong: API access for platforms | Yes |
| Dexcom Stelo | 15 days | App-based (OTC) | Limited: no provider portal | No |
| FreeStyle Libre 3 | 14 days | Cloud (LibreView) | Strong: provider dashboard | Yes |
| FreeStyle Libre 2 | 14 days | Cloud (LibreView) | Moderate: requires scan or app | Optional |
| Medtronic Guardian 4 | 7 days | CareLink platform | Limited: primarily for pump users | Yes |

For most primary care RPM programs, the Dexcom G7 and FreeStyle Libre 3 are the strongest options. Both offer cloud-based provider dashboards, API access for RPM platform integration, and continuous real-time data without requiring patient interaction after sensor insertion.

### Insurance and Coverage Considerations

CGM coverage varies significantly by payer. Medicare covers CGM for patients with diabetes who meet specific criteria, typically requiring insulin use or a documented history of problematic hypoglycemia. Commercial payers have their own criteria, and many still require prior authorization.

The cost difference between prescribing a CGM and a standard glucose meter is meaningful. If your RPM program margins depend on device costs staying low, run the numbers for your specific patient population and payer mix before committing to CGM as a default device.

## Data Transmission Considerations

CGM data transmission for RPM has a specific wrinkle that catches many practices off guard: the 16-day rule.

To bill CPT 99454 (device supply with daily data transmission), your patient's device must transmit data on at least 16 of 30 days in the billing period. With CGM, this is usually straightforward, as long as the sensor is active and the patient's phone (or receiver) is syncing to the cloud, data flows automatically.

But gaps happen. Common causes include:

- **Sensor changes:** a 10-day sensor that expires on day 22 leaves a gap if the patient delays replacement by even 3 days
- **Phone issues:** Bluetooth disconnection, app crashes, or phone upgrades can interrupt data flow
- **Sensor failures:** occasional sensors fail early, creating unplanned gaps
- **Patient travel:** international travel may disrupt cellular data or app connectivity

### Mitigating Transmission Gaps

Build a system to monitor transmission status proactively. Your clinical team should review data flow at least weekly and flag patients who are at risk of falling below the 16-day threshold before the billing period closes. Specifically:

- Set up alerts at day 10 if fewer than 8 days of data have been received
- Contact patients immediately when a sensor session ends to confirm replacement
- Keep backup sensors available for patients who experience early failures
- Document all outreach attempts for patients with transmission gaps

> **Billing Note:** If a patient's CGM data transmits for only 14 of 30 days, you cannot bill 99454 for that month. There is no partial credit. Track this metric rigorously.

## Clinical Interpretation of CGM Data

The volume of CGM data can be overwhelming for clinical teams accustomed to reviewing 4 fingerstick values per visit. The key is focusing on standardized CGM metrics rather than individual readings.

### The AGP Report

The Ambulatory Glucose Profile (AGP) is the standardized reporting format endorsed by the International Consensus on Use of CGM. Every major CGM platform generates AGP reports. Your clinical team should learn to read these fluently.

An AGP report consolidates 14 days of CGM data into a single-page visual summary. The critical metrics are:

| Metric | Target (Type 2 Diabetes) | What It Tells You |
|--------|--------------------------|-------------------|
| Time in Range (70–180 mg/dL) | >70% | Overall glycemic control |
| Time Below Range (<70 mg/dL) | <4% | Hypoglycemia risk |
| Time Significantly Below (<54 mg/dL) | <1% | Severe hypoglycemia risk |
| Time Above Range (>180 mg/dL) | <25% | Hyperglycemia burden |
| Glucose Management Indicator (GMI) | Individualized | Estimated A1C from CGM data |
| Coefficient of Variation (CV) | <36% | Glycemic variability |

### Prioritizing Clinical Action

When reviewing CGM data for RPM, apply a triage framework:

1. **Address safety first:** Any time below 54 mg/dL requires immediate clinical review. Look at timing: is it nocturnal? Post-exercise? Related to medication timing?
2. **Assess overall control:** Time in Range is the single most useful metric. A TIR below 50% in a Type 2 patient warrants a medication review.
3. **Look at patterns, not individual readings:** A single spike to 250 mg/dL after a holiday meal is not clinically significant. A pattern of post-breakfast spikes above 200 every day for two weeks is.
4. **Use the daily profiles:** The AGP overlay shows where glucose typically rises and falls. This identifies the specific times of day where interventions (medication timing, meal composition, activity) can have the most impact.

### Documenting CGM Reviews for RPM Billing

When billing CPT 99457 and 99458 for clinical staff time, your documentation must reflect the actual clinical work performed. For CGM-based RPM, a strong note includes:

- The date range of CGM data reviewed
- Specific metrics referenced (TIR, time below range, GMI, CV)
- Clinical patterns identified
- Actions taken or recommended (medication change, patient education, referral)
- Time spent on review and any patient communication

Vague notes like "Reviewed CGM data, no changes" do not support billing. Even when no medication change is made, document the clinical reasoning: "Reviewed 14-day AGP report. TIR 74%, time below range 2%, CV 31%. Current regimen achieving targets. Reinforced meal timing with patient via phone. Total clinical time: 22 minutes."

## Building a CGM-Based RPM Workflow

Integrating CGM into your RPM program requires workflow adjustments at several stages.

### Enrollment

During enrollment, your team needs to:

- Verify CGM coverage with the patient's insurer
- Obtain prior authorization if required
- Select the appropriate device based on patient needs and payer requirements
- Schedule an in-person or telehealth visit for initial sensor placement and education (billable under 99453)
- Confirm the patient's smartphone compatibility and install the CGM app
- Link the patient's CGM account to your provider dashboard

### Ongoing Monitoring

Establish a regular cadence for CGM data review. Most practices find that a weekly review of AGP summaries is the right balance between clinical rigor and staff workload. Flag patients who need intervention, and batch your outreach calls.

### Sensor Replacement Coordination

Unlike a Bluetooth glucose meter that a patient uses indefinitely, CGM sensors expire. A 14-day sensor needs replacement roughly twice per month. Your team must track sensor schedules and ensure patients have supplies on hand. A missed sensor change can cost you an entire month of 99454 billing.

## When CGM Is Worth the Added Complexity

CGM adds real clinical value to RPM programs, but it is not a universal solution. For patients with complex glycemic profiles, it removes the adherence barrier that undermines fingerstick-based RPM. It also adds cost and workflow complexity.

The practices that succeed with CGM-based RPM are the ones that match the right device to the right patient, build systems to monitor data transmission, and train their clinical teams to interpret CGM reports efficiently.

If you are building or scaling a diabetes-focused RPM program and want to automate the compliance and billing side, including transmission tracking and documentation, [Zayd Health](https://www.zaydhealth.com) was built for this workflow.

## Key Takeaways

- CGM provides dramatically more data than fingerstick meters but is not cost-effective for every patient
- Dexcom G7 and FreeStyle Libre 3 currently offer the strongest RPM integration capabilities
- The 16-day transmission rule still applies; passive data collection helps, but sensor gaps can break compliance
- Train your team on AGP reports and the five core CGM metrics (TIR, time below range, GMI, CV, time above range)
- Document CGM reviews with specific metrics and clinical reasoning to support 99457/99458 billing
