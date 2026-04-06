---
title: "RPM EHR Integration Guide: Approaches, Compatibility, and Common Pitfalls"
description: "A practical RPM EHR integration guide covering API, HL7/FHIR, and manual approaches for Epic, athenahealth, eClinicalWorks, and Allscripts."
date: "2025-09-05"
author: "Mohammed Ali"
tags: ["rpm", "operations", "technology"]
image: "/blog/ehr-integration.webp"
status: "published"
---

One of the first questions practice managers ask when evaluating an RPM platform is "does it integrate with our EHR?" It is the right question, but it is incomplete. The more important questions are: what data flows between the systems, in which direction, and what happens when the integration breaks?

Poor EHR integration is the single most common source of provider frustration with RPM programs. Clinicians do not want to log into a separate portal. They want RPM data inside the chart they already use. But the difference between a well-executed integration and a poorly executed one is the difference between a sustainable program and one that providers abandon within six months.

This RPM EHR integration guide covers the three main integration approaches, compatibility considerations for the most common EHR platforms, data flow architecture decisions, and the pitfalls that derail implementations.

## Three Integration Approaches

There is no single right way to connect an RPM platform to an EHR. The best approach depends on your EHR's capabilities, your RPM vendor's technical maturity, and how much you are willing to invest in the connection.

### Approach 1: Direct API Integration

Direct API integration means the RPM platform communicates with the EHR through a programmatic interface, pushing and pulling data in real time or near-real time. This is the gold standard, but it is also the most complex and expensive to implement.

**What it looks like in practice:** RPM clinical summaries, glucose trends, and alert notifications appear directly in the patient's chart as structured data. Orders and patient demographics flow from the EHR to the RPM platform automatically. When a provider documents a response to an RPM alert, it is recorded in both systems.

**Requirements:** The EHR must expose a well-documented API (REST or SOAP), the RPM vendor must have built and maintained a connector for your specific EHR, and someone needs to manage the API credentials, rate limits, and error handling on an ongoing basis.

### Approach 2: HL7/FHIR Messaging

HL7 v2 messages and FHIR (Fast Healthcare Interoperability Resources) are healthcare-specific data exchange standards. HL7 v2 has been the workhorse of clinical data exchange for decades, while FHIR is the modern standard that most EHR vendors are actively adopting.

**What it looks like in practice:** The RPM platform sends standardized messages (ADT for demographics, ORU for results, MDM for documents) to an integration engine or directly to the EHR's HL7 listener. Data arrives in the chart as lab results, clinical documents, or flowsheet entries depending on the message type.

**Requirements:** An HL7 interface engine (Mirth Connect, Rhapsody, or a cloud-based alternative), network connectivity between systems (VPN or secure tunnel), and HL7/FHIR mapping expertise for initial configuration. Many practices use a third-party integration partner for this work.

### Approach 3: Manual or Semi-Manual Transfer

For practices that need RPM running quickly or whose EHR has limited integration capabilities, manual transfer is a legitimate starting point. It is not ideal long-term, but it is far better than delaying your program for months while waiting for an API connector.

**What it looks like in practice:** The RPM platform generates PDF summaries or CSV exports. Staff upload these as documents in the patient chart, or copy key data points into encounter notes. Some platforms offer a "clipboard" feature that formats data for easy paste into an EHR note template.

**Requirements:** Minimal technical setup. The cost is staff time, typically 2-3 minutes per patient per month for the data transfer step. At 100 patients, that is 3-5 additional staff hours monthly.

### Comparison of Integration Approaches

| Factor | Direct API | HL7/FHIR | Manual/Semi-Manual |
|---|---|---|---|
| Setup time | 8-16 weeks | 4-10 weeks | 1-2 days |
| Setup cost | $5,000-$25,000+ | $2,000-$10,000 | Near zero |
| Ongoing maintenance | Moderate (API versioning, credential management) | Low-moderate (message format updates) | High (staff time per patient) |
| Data freshness | Real-time or near-real-time | Near-real-time (minutes) | Daily or weekly batches |
| Provider experience | Transparent: data appears in existing workflow | Good: data appears as results or documents | Acceptable: data available but may require navigation |
| Scalability | Excellent | Good | Poor above 75-100 patients |
| EHR vendor dependency | High: requires vendor cooperation | Moderate: uses standards | None |

> **Tip:** If your practice has fewer than 50 RPM patients, start with manual or semi-manual transfer. Use the first 3-6 months to prove program viability and generate revenue, then invest integration dollars once you have confirmed RPM is a long-term commitment. You can always upgrade the integration approach later without disrupting the clinical program.

## EHR-Specific Compatibility Notes

Not all EHRs are created equal when it comes to RPM integration. Here is what to expect from the platforms most common in primary care.

### Epic

Epic offers several integration pathways. The App Orchard (now renamed to the Epic App Market) is the primary mechanism for third-party applications. RPM vendors listed on the App Market have pre-built connectors that use Epic's FHIR APIs and can surface data in the patient chart, Storyboard, and In Basket.

For practices on Epic Community Connect or hosted Epic, integration options may be limited by your hosting organization's policies. Always confirm with your Epic administrator before assuming a marketplace app can be activated for your instance.

**Key consideration:** Epic's integration review process is thorough but slow. If your RPM vendor is not already on the App Market, expect 6-12 months before a direct integration is available. In the interim, use CDA document injection via standard HL7 interfaces, as most Epic installations accept inbound HL7 ORU messages with embedded PDF reports.

### athenahealth

athenahealth has one of the more open ecosystems for third-party integration through its Marketplace program and athenaFlex API. RPM vendors can push clinical data into the patient chart as clinical documents, and pull patient demographics and insurance information to streamline enrollment.

The athena Marketplace vetting process is faster than Epic's, and the FHIR-based API is well-documented. Most RPM platforms with athena connectors can be live within 4-6 weeks.

**Key consideration:** athenahealth's document storage model means RPM data often arrives as a clinical document rather than discrete flowsheet data. This is fine for clinical review but limits the ability to trend RPM data alongside other vitals within athena's native charting tools.

### eClinicalWorks (eCW)

eClinicalWorks supports HL7 interfaces and has a growing FHIR capability, but integration quality varies significantly depending on your eCW version and hosting model (cloud vs. on-premise). eCW's internal RPM module competes with third-party platforms, which can create friction during integration discussions.

**Key consideration:** If you are on eCW, ask your RPM vendor specifically about their eCW integration track record. Request references from practices of similar size running the same eCW version. Generic "we integrate with eCW" claims often mask a manual or semi-manual workflow behind the scenes.

### Allscripts (now Veradigm)

Allscripts has undergone significant corporate restructuring, rebranding to Veradigm for its technology platform. Integration capabilities depend heavily on which Allscripts product you use (Professional, Touchworks, Sunrise) and whether you are on a current version.

Allscripts supports HL7 v2 interfaces and has FHIR endpoints available through its developer program. However, the connector ecosystem is smaller than Epic or athena, meaning fewer RPM vendors have pre-built integrations.

**Key consideration:** Confirm that your specific Allscripts product and version are supported before signing an RPM vendor contract. "Allscripts compatible" is not meaningful without specifying the product line.

## Data Flow Architecture Decisions

Before implementing any integration, you need to decide what data moves between systems and in which direction. Getting this wrong creates either data gaps or data overload.

### What Should Flow FROM the RPM Platform TO the EHR

| Data Element | Format | Frequency | Purpose |
|---|---|---|---|
| Daily glucose readings | Flowsheet/discrete data or summary document | Daily or weekly | Clinical trending and decision-making |
| Clinical alerts (critical highs/lows) | In Basket message or notification | Real-time | Timely provider intervention |
| Monthly RPM summary | Clinical document (PDF or CDA) | Monthly | Chart documentation for billing support |
| Device assignment status | Discrete field or note | On change | Confirms active monitoring |
| Cumulative monitoring time log | Clinical document | Monthly | Supports 99457/99458 billing documentation |

### What Should Flow FROM the EHR TO the RPM Platform

| Data Element | Format | Frequency | Purpose |
|---|---|---|---|
| Patient demographics | ADT message or API pull | On change | Keeps RPM records current |
| Insurance/payer information | Eligibility data | On change or monthly | Validates billing eligibility |
| Problem list / diagnosis codes | CCD or FHIR resource | On change | Confirms qualifying diagnoses for RPM |
| Medication list | CCD or FHIR resource | On change | Contextualizes glucose readings |
| Provider assignments | Scheduling data | On change | Routes alerts to correct provider |

### Bidirectional Considerations

True bidirectional integration (where both systems read and write to each other in real time) is the most powerful but also the most fragile configuration. Every bidirectional data element creates a potential conflict: what happens when a nurse updates a phone number in the RPM platform while the front desk updates it in the EHR simultaneously?

For most primary care practices, the practical recommendation is: **EHR is the system of record for demographics and clinical data; RPM platform is the system of record for device data, monitoring time, and transmission compliance.** Data flows in both directions, but each system "owns" specific data elements with clear conflict resolution rules.

## Common Integration Pitfalls

### Pitfall 1: Assuming Integration Means Automation

An "integrated" RPM platform might simply mean a PDF gets dropped into the patient chart. That is integration, technically, but it does not automate anything. When evaluating vendor claims, ask exactly what data flows automatically and what still requires manual steps.

### Pitfall 2: Ignoring the Testing Phase

Integration testing with live patient data in a production EHR environment is critical and frequently rushed. Budget at least 2-4 weeks for testing with a pilot group of 5-10 patients before going live. Test edge cases: what happens when a patient is discharged and re-admitted? When insurance changes? When a device is swapped?

### Pitfall 3: No Monitoring for Integration Failures

HL7 interfaces and API connections fail silently more often than you would expect. A dropped VPN connection, an expired API token, or a changed firewall rule can stop data flow for days before anyone notices. Ensure someone (or something) is monitoring the integration health daily.

### Pitfall 4: Over-Engineering the Initial Integration

Practices sometimes delay their RPM program for months while pursuing a perfect API integration. Meanwhile, they are leaving revenue on the table and patients unmonitored. A phased approach (start with manual transfer, move to HL7 document injection, and eventually implement full API integration) is almost always the better strategy.

### Pitfall 5: Neglecting Provider Training on Integrated Data

Even a perfectly executed technical integration fails if providers do not know where to find RPM data in their chart or how to interpret the summaries. Dedicate time during the launch to walk each provider through exactly where RPM information appears in their existing EHR workflow.

> **Tip:** Create a one-page quick reference card showing providers exactly where RPM data appears in the EHR, which tab, which section, what it looks like. Laminate it and place one in each workstation. This simple step dramatically reduces the "I never see the RPM data" complaint.

## Choosing the Right Integration Path for Your Practice

The integration decision ultimately comes down to three factors: your current patient volume, your EHR platform's openness, and your timeline.

If you are launching a new RPM program, do not let integration complexity delay enrollment. Start with the simplest viable approach, prove the program's clinical and financial value, and invest in deeper integration as the patient census grows.

For practices already running RPM at scale and struggling with provider adoption, upgrading the EHR integration is often the highest-impact investment you can make. When RPM data appears directly in the clinical workflow, provider engagement follows.

Platforms like [Zayd Health](https://www.zaydhealth.com) are designed to support multiple integration approaches simultaneously, allowing practices to start simple and deepen the integration over time without disrupting the clinical program or rebuilding workflows from scratch.

## What Matters Most for EHR Integration

EHR integration is important, but it is not a prerequisite for a successful RPM program. The practices that scale RPM most effectively are the ones that match their integration approach to their current stage of growth, plan data flows deliberately, and avoid the common pitfalls that turn a technology project into a clinical workflow problem. Start where you are, integrate what matters most, and build from there.
