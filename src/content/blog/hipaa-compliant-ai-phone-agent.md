---
title: "Is an AI Phone Agent HIPAA Compliant? What NEMT Operators Need to Know"
description: "What HIPAA actually requires from a phone-based AI intake vendor, the questions to ask before you sign, and the common misconceptions that trip operators up."
date: "2026-08-22"
author: "Seer Mobility Team"
tags: ["compliance", "hipaa"]
status: "published"
---

Every call an NEMT dispatch line takes touches protected health information: a rider's name, their pickup and drop-off addresses tied to a medical appointment, sometimes their insurance or Medicaid ID, sometimes the reason for the trip. That's true whether the call is answered by a person or by software, which is exactly why "is this HIPAA compliant?" is the right first question to ask about any AI phone agent, not an afterthought to raise after you've already signed a contract.

## HIPAA compliance isn't a certification, it's a relationship

There's no government body that stamps a product "HIPAA compliant" the way a device gets FDA-cleared. HIPAA compliance is a set of legal and technical obligations that apply to how PHI is handled, and when a vendor handles PHI on your behalf, the two of you need a **Business Associate Agreement (BAA)**, a contract that makes the vendor legally accountable for safeguarding that data the same way you are. If a vendor can't or won't sign a BAA, that's the whole conversation, regardless of how sophisticated their technology is.

## What a BAA actually needs to cover

Signing a BAA is necessary but not sufficient on its own. The agreement, and the practices behind it, need to address a few concrete things:

**Encryption in transit and at rest.** Call audio, transcripts, and any structured data extracted from the call (name, address, appointment details) should be encrypted both while being transmitted and while stored.

**Access controls and audit logs.** Who inside the vendor's organization can access call data, and is there a record of when they did? This matters as much for your own peace of mind as for a potential audit.

**Data retention and minimization.** How long is call audio or transcript data kept, and is it deleted or de-identified once it's no longer needed for the purpose it was collected for? A vendor that retains everything indefinitely with no stated policy is a red flag.

**Subprocessor coverage.** Most AI phone agents are built on top of other vendors: a speech-to-text provider, a language model API, a telephony carrier. If any of those subprocessors touch PHI, they need their own BAA with your vendor, not just your vendor with you. This is the layer operators most often forget to ask about.

## Questions worth asking before you sign

- Will you sign a BAA, and can I see language addressing the points above rather than a generic assurance?
- Where is call audio and transcript data stored, for how long, and can I get a copy or request deletion?
- Which subprocessors (LLM provider, speech recognition, telephony) touch call data, and are they each covered under a BAA?
- What happens to my data if I cancel the contract?
- Can you show me your access control and audit logging setup, not just describe it?

A vendor that answers these specifically, rather than with marketing language, is generally the one that has actually built the compliance work into their product rather than bolted it on afterward.

## Common misconceptions

**"Using a mainstream AI model automatically makes it non-compliant."** The major LLM and cloud providers offer enterprise tiers that support BAAs and don't use submitted data for model training. The compliance question isn't which underlying model a vendor uses, it's whether the vendor has actually signed the applicable agreements with that provider and configured the integration correctly.

**"If it sounds human, it must be handling data casually."** How natural an AI voice agent sounds on the phone has nothing to do with how it stores or protects the data from that call. These are separate engineering concerns, and a vendor can be excellent at one and negligent at the other.

**"A generic answering service is automatically safer because it's human."** A human answering service handling PHI over the phone needs the exact same BAA and safeguards as any software vendor. Being staffed by people doesn't exempt a vendor from HIPAA, and plenty of answering services handle this less rigorously than a purpose-built system that was designed around it from the start.

## Frequently asked questions

**Do I need a BAA if the AI agent only books rides and doesn't touch billing?**
Yes. Pickup and drop-off addresses tied to a scheduled medical appointment are PHI on their own, independent of whether billing or insurance information is discussed on the same call.

**Is call recording for quality purposes still subject to HIPAA?**
Yes. Any recording or transcript containing PHI is covered, regardless of the reason it was created or how it's labeled internally.

**What's the difference between HIPAA compliance and SOC 2?**
SOC 2 is a security and operational controls audit that many vendors pursue as evidence of good practice, but it isn't a HIPAA substitute. A vendor can hold a SOC 2 report and still need a BAA, and the two should be evaluated separately.

**Can a small NEMT operator even get a BAA from a vendor, or is that only for large accounts?**
Legitimate healthcare-focused vendors offer a BAA as standard practice regardless of account size, since the legal obligation doesn't scale with company size. If a vendor treats it as a premium add-on or is vague about it, that's worth pressing on before signing.

## Evaluating a vendor for your fleet

Ask the questions above of any AI phone agent or answering service before you hand it a single call, not after. If you want to see how these safeguards work in a real system, [request a live call](/#contact) and ask us directly.
