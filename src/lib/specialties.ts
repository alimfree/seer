export interface Specialty {
  slug: string
  name: string
  title: string
  description: string
  metaDescription: string
  hero: string
  valueProps: Array<{ icon: string; title: string; text: string }>
  faqs: Array<{ question: string; answer: string }>
  relatedSlugs: string[]
}

export const SPECIALTIES: Specialty[] = [
  {
    slug: 'primary-care',
    name: 'Primary Care',
    title: 'RPM for Primary Care Practices',
    description: 'Primary care practices manage the largest diabetic patient panels — and leave the most RPM revenue on the table. Zayd automates the compliance documentation so your team can bill for the monitoring you already do.',
    metaDescription: 'How primary care practices use remote patient monitoring to generate new revenue from diabetic patients. Transmission tracking, time logging, and audit-ready superbills.',
    hero: 'Turn your diabetic patient panel into a revenue stream — without adding staff.',
    valueProps: [
      { icon: 'patient_list', title: 'Built for large panels', text: 'Manage 50–500 RPM patients with one MA. Automatic transmission tracking and time logging eliminates manual spreadsheets.' },
      { icon: 'receipt_long', title: 'Superbills your biller can use', text: 'CMS-1500 ready documentation with every CPT code justified. Your existing biller submits the claim.' },
      { icon: 'schedule', title: '20 minutes, documented', text: 'Timestamped clinician review time captures every second. No more estimating or self-reporting.' },
      { icon: 'verified', title: 'Audit-ready from day one', text: 'Every claim links to a timestamped audit trail — transmission days, review minutes, and call logs.' },
    ],
    faqs: [
      { question: 'How many patients can one MA manage in an RPM program?', answer: 'With Zayd handling the documentation, a single MA can typically manage 80–120 RPM patients. The monthly call takes 10–15 minutes per patient, and all compliance tracking is automated.' },
      { question: 'Do I need to change my EHR workflow?', answer: 'No. Zayd works alongside your existing EHR. Your MA reviews glucose data in Zayd, logs the call, and exports the superbill. No integration or data migration required.' },
      { question: 'What revenue can a 3-physician primary care practice expect?', answer: 'At 50 enrolled patients billing CPT 99457, a practice generates approximately $31,000 per year in new revenue. Adding CCM stacking (99490) can push that to $69,000+.' },
      { question: 'Which payers reimburse for RPM in primary care?', answer: 'Most major commercial payers (Aetna, BCBS, Cigna) cover RPM. Medicare also covers RPM under specific conditions. Coverage varies by plan and state — always verify benefits before enrollment.' },
    ],
    relatedSlugs: ['how-to-start-rpm-program-primary-care', 'rpm-workflow-small-practice', 'rpm-staff-training-guide', 'rpm-patient-enrollment-best-practices', 'rpm-revenue-per-patient-calculator'],
  },
  {
    slug: 'endocrinology',
    name: 'Endocrinology',
    title: 'RPM for Endocrinology Practices',
    description: 'Endocrinologists already prescribe CGMs and review glucose data. RPM billing turns that clinical work into a documented revenue stream — without changing your workflow.',
    metaDescription: 'RPM billing for endocrinology practices. Automate CGM data tracking, clinician time logging, and superbill generation for diabetic patients.',
    hero: 'You already review CGM data. Now get paid for it.',
    valueProps: [
      { icon: 'monitoring', title: 'CGM data you already use', text: 'Zayd connects to Dexcom G7 and tracks transmission days automatically. No manual counting.' },
      { icon: 'receipt_long', title: 'Bill beyond the office visit', text: 'RPM codes (99457, 99458) reimburse for between-visit monitoring — revenue your practice earns but doesn\'t capture today.' },
      { icon: 'analytics', title: 'Track A1C impact', text: 'Document the clinical value of continuous monitoring with timestamped review logs that correlate with patient outcomes.' },
      { icon: 'verified', title: 'Compliance without the overhead', text: 'Automated transmission day tracking, review time logging, and call documentation. Every claim is audit-ready.' },
    ],
    faqs: [
      { question: 'How is RPM billing different from regular CGM management?', answer: 'Office visits bill E/M codes for in-person care. RPM codes (99457, 99458) specifically reimburse for remote data review and patient communication between visits — time you already spend but don\'t bill for.' },
      { question: 'Can I bill RPM if the patient also sees a PCP?', answer: 'Yes. Only one provider can bill RPM per patient per month. If you\'re the one reviewing glucose data and making the monthly call, you bill the RPM codes. Coordinate with the PCP to avoid duplicate billing.' },
      { question: 'What\'s the revenue opportunity for an endocrinology practice?', answer: 'An endocrinologist with 100 CGM patients billing 99457 monthly generates approximately $62,000/year. Many practices also qualify for CCM stacking, which can nearly double that.' },
    ],
    relatedSlugs: ['continuous-glucose-monitoring-rpm-guide', 'rpm-a1c-reduction-strategies', 'diabetes-remote-monitoring-outcomes', 'managing-diabetic-patients-between-visits'],
  },
  {
    slug: 'internal-medicine',
    name: 'Internal Medicine',
    title: 'RPM for Internal Medicine Practices',
    description: 'Internal medicine physicians manage complex, multi-morbid patients — many with diabetes. RPM provides a structured way to monitor between visits and bill for the oversight you already provide.',
    metaDescription: 'Remote patient monitoring for internal medicine. Automate RPM compliance documentation for diabetic patients with multiple chronic conditions.',
    hero: 'Your most complex patients need monitoring between visits. Now you can bill for it.',
    valueProps: [
      { icon: 'clinical_notes', title: 'Multi-condition monitoring', text: 'Diabetic patients with hypertension, CKD, or cardiac disease benefit most from RPM. Document monitoring for each condition.' },
      { icon: 'receipt_long', title: 'Stack RPM + CCM', text: 'Patients with 2+ chronic conditions qualify for both RPM (99457) and CCM (99490). Same patient, separate billable time, double the revenue.' },
      { icon: 'schedule', title: 'Efficient MA delegation', text: 'Monthly calls and data review can be performed by your MA under general supervision. Zayd tracks their time automatically.' },
      { icon: 'verified', title: 'Documentation that survives audits', text: 'Timestamped review logs, call records, and transmission data. Every claim backed by evidence.' },
    ],
    faqs: [
      { question: 'Can I bill RPM and CCM for the same patient?', answer: 'Yes, if the patient has 2+ chronic conditions. RPM and CCM track separate time — RPM covers device data review and the monthly call, CCM covers care coordination and medication management. Time cannot overlap.' },
      { question: 'How does RPM fit into an internist\'s workflow?', answer: 'Your MA reviews glucose data in Zayd, makes the monthly call, and documents findings — typically 20 minutes per patient. The physician reviews flagged patients only. Zayd handles compliance tracking and superbill generation.' },
      { question: 'What types of patients should I enroll first?', answer: 'Start with commercially insured diabetic patients on 3+ medications. They\'re the most likely to have clean coverage, the highest clinical need for monitoring, and the best reimbursement rates.' },
    ],
    relatedSlugs: ['ccm-vs-rpm-billing-differences', 'chronic-care-management-billing-guide', 'rpm-workflow-small-practice', 'scaling-rpm-program-100-patients'],
  },
  {
    slug: 'cardiology',
    name: 'Cardiology',
    title: 'RPM for Cardiology Practices',
    description: 'Diabetic patients with cardiovascular disease are among the highest-risk populations — and the most responsive to remote monitoring. RPM gives your practice the documentation to bill for the oversight these patients require.',
    metaDescription: 'RPM for cardiology practices managing diabetic patients. Monitor glucose alongside cardiovascular risk with automated compliance documentation.',
    hero: 'Diabetic cardiac patients need closer monitoring. RPM makes it billable.',
    valueProps: [
      { icon: 'cardiology', title: 'Cardiovascular-metabolic overlap', text: 'Beta-blockers, thiazides, and statins affect glucose control. RPM tracks the metabolic impact of cardiac medications in real time.' },
      { icon: 'monitoring', title: 'Continuous glucose visibility', text: 'CGM data reveals how cardiac medications and lifestyle changes affect blood sugar — insights you can\'t get from quarterly A1C tests.' },
      { icon: 'receipt_long', title: 'New revenue from existing patients', text: 'Bill RPM codes for between-visit monitoring of diabetic cardiac patients. Your existing panel, new reimbursement.' },
      { icon: 'verified', title: 'Audit-ready documentation', text: 'Automated transmission tracking, timestamped review logs, and structured call documentation for every patient.' },
    ],
    faqs: [
      { question: 'Which cardiac medications affect glucose that RPM can help monitor?', answer: 'Beta-blockers can mask hypoglycemia symptoms. Thiazide diuretics can raise blood sugar. Statins carry a small diabetes risk. RPM provides continuous glucose data to catch these effects between visits.' },
      { question: 'Can a cardiologist bill RPM for diabetic patients?', answer: 'Yes, if you\'re the provider ordering and overseeing the monitoring. The key is documenting that you\'re reviewing the data and making the monthly interactive contact. Only one provider can bill RPM per patient per month.' },
      { question: 'How does this integrate with blood pressure monitoring?', answer: 'While Zayd currently focuses on glucose monitoring via CGM, practices often pair it with blood pressure RPM. The compliance framework — transmission tracking, time logging, documentation — applies to both.' },
    ],
    relatedSlugs: ['cardiac-medications-glucose-monitoring', 'rpm-blood-pressure-monitoring-diabetic-patients', 'managing-diabetic-patients-between-visits'],
  },
  {
    slug: 'psychiatry',
    name: 'Psychiatry',
    title: 'RPM for Psychiatry-Adjacent Primary Care',
    description: 'Psychiatric medications are among the most significant disruptors of glucose control. Primary care practices managing diabetic patients on SSRIs, antipsychotics, or mood stabilizers need structured monitoring — and RPM provides the framework to bill for it.',
    metaDescription: 'RPM monitoring for diabetic patients on psychiatric medications. Track glucose disruptions from SSRIs, antipsychotics, and mood stabilizers with automated documentation.',
    hero: 'Psychiatric medications change glucose. RPM helps you catch it early.',
    valueProps: [
      { icon: 'psychology', title: 'Medication-glucose interaction tracking', text: 'SSRIs cause weight gain. Antipsychotics trigger metabolic syndrome. Mood stabilizers disrupt insulin sensitivity. CGM data reveals these effects in real time.' },
      { icon: 'clinical_notes', title: 'Evidence for dosage decisions', text: 'Timestamped glucose data during medication changes gives you and the prescribing psychiatrist objective evidence for dose adjustments.' },
      { icon: 'receipt_long', title: 'Billable monitoring during transitions', text: 'The first 90 days after starting or changing a psychiatric medication is the highest-risk period. RPM makes that monitoring billable.' },
      { icon: 'verified', title: 'Documentation for dual-diagnosis care', text: 'Structured records linking glucose trends to medication changes — valuable for care coordination and audit defense.' },
    ],
    faqs: [
      { question: 'Which psychiatric medications most affect blood sugar?', answer: 'Atypical antipsychotics (olanzapine, quetiapine, risperidone) carry the highest metabolic risk. SSRIs like paroxetine cause significant weight gain. Mood stabilizers like valproate affect insulin sensitivity. All warrant glucose monitoring.' },
      { question: 'Is this for psychiatrists or primary care?', answer: 'This is for primary care and internal medicine practices that manage diabetic patients who are also on psychiatric medications. The PCP manages the glucose — not the psychiatrist — and bills RPM accordingly.' },
      { question: 'How does RPM help during psychiatric medication changes?', answer: 'CGM data shows glucose trends during the weeks after a medication start, change, or dose adjustment. This gives you early warning of metabolic disruption before it shows up in lab work.' },
    ],
    relatedSlugs: ['psychiatric-medications-glucose-monitoring', 'managing-diabetic-patients-between-visits', 'continuous-glucose-monitoring-rpm-guide'],
  },
  {
    slug: 'nephrology',
    name: 'Nephrology',
    title: 'RPM for Nephrology Practices',
    description: 'Diabetic kidney disease is the leading cause of CKD. As renal function declines, glucose metabolism changes — A1C becomes unreliable and medication dosing shifts. RPM provides the continuous data these patients require.',
    metaDescription: 'Remote patient monitoring for nephrology practices managing diabetic kidney disease. Track glucose in CKD patients where A1C is unreliable.',
    hero: 'When A1C stops telling the truth, CGM data fills the gap.',
    valueProps: [
      { icon: 'nephrology', title: 'Beyond unreliable A1C', text: 'Reduced red blood cell lifespan in CKD falsely lowers A1C readings. CGM provides accurate, real-time glucose data that A1C cannot.' },
      { icon: 'clinical_notes', title: 'Medication dose adjustments', text: 'As GFR declines, metformin must be reduced and insulin clearance changes. CGM data guides these adjustments between visits.' },
      { icon: 'receipt_long', title: 'RPM + CCM stacking', text: 'CKD + diabetes qualifies for both RPM and CCM billing. Two revenue streams from patients who already need close monitoring.' },
      { icon: 'verified', title: 'Automated compliance', text: 'Transmission tracking, review time logging, and call documentation — no manual tracking required.' },
    ],
    faqs: [
      { question: 'Why is A1C unreliable in CKD patients?', answer: 'CKD shortens red blood cell lifespan, which means A1C underestimates average glucose. Patients may appear well-controlled by A1C while experiencing dangerous glucose variability. CGM captures what A1C misses.' },
      { question: 'At what CKD stage should I start RPM?', answer: 'Stage 3 and beyond is where A1C reliability begins to decline and medication adjustments become more frequent. These patients benefit most from continuous glucose monitoring and are excellent RPM candidates.' },
      { question: 'Can nephrology bill RPM alongside dialysis codes?', answer: 'RPM billing is separate from dialysis codes. However, coordination is required — ensure the RPM monitoring time does not overlap with dialysis management time. Consult your billing team for payer-specific rules.' },
    ],
    relatedSlugs: ['ckd-diabetes-glucose-monitoring', 'managing-diabetic-patients-between-visits', 'continuous-glucose-monitoring-rpm-guide'],
  },
  {
    slug: 'bariatrics',
    name: 'Bariatrics',
    title: 'RPM for Bariatric Programs',
    description: 'GLP-1 medications and bariatric surgery dramatically alter glucose metabolism. Patients who were insulin-dependent may achieve remission — or experience dangerous hypoglycemia. RPM monitors these transitions safely and generates billable documentation.',
    metaDescription: 'RPM for bariatric programs monitoring post-surgical and GLP-1 patients. Track glucose changes during weight loss with automated compliance documentation.',
    hero: 'Weight loss changes glucose dramatically. RPM tracks the transition.',
    valueProps: [
      { icon: 'monitoring', title: 'Post-surgical glucose tracking', text: 'Gastric bypass and sleeve gastrectomy can resolve Type 2 diabetes within weeks. CGM monitors the rapid glucose changes during this period.' },
      { icon: 'medication', title: 'GLP-1 medication management', text: 'Semaglutide and tirzepatide improve insulin sensitivity progressively. RPM data shows when to reduce diabetes medications during weight loss.' },
      { icon: 'receipt_long', title: 'Bill for monitoring you already do', text: 'Post-bariatric glucose monitoring is standard of care. RPM codes reimburse for the between-visit oversight these patients need.' },
      { icon: 'verified', title: 'Document the clinical journey', text: 'Timestamped records of glucose improvement during weight loss — valuable for patient motivation, care decisions, and audit defense.' },
    ],
    faqs: [
      { question: 'How quickly does glucose change after bariatric surgery?', answer: 'Many patients see significant glucose improvement within 1-2 weeks post-surgery, often before significant weight loss. Some patients require rapid insulin dose reductions to avoid hypoglycemia. CGM makes this visible in real time.' },
      { question: 'Should I monitor patients on GLP-1s with RPM?', answer: 'Yes, especially during the first 3-6 months of dose titration. GLP-1 medications progressively improve insulin sensitivity, which means existing diabetes medications may need reduction. RPM provides the glucose data to guide these decisions.' },
      { question: 'Can bariatric programs bill RPM for pre-surgical patients?', answer: 'Yes, if the patient has a qualifying diagnosis (Type 2 diabetes) and meets the RPM requirements. Pre-surgical glucose optimization with RPM data can improve surgical outcomes and generate revenue during the waiting period.' },
    ],
    relatedSlugs: ['obesity-medications-glucose-monitoring', 'rpm-a1c-reduction-strategies', 'continuous-glucose-monitoring-rpm-guide'],
  },
  {
    slug: 'ob-gyn',
    name: 'OB-GYN',
    title: 'RPM for OB-GYN Practices',
    description: 'Gestational diabetes affects 10% of pregnancies, and women with a history of GDM face 50% lifetime risk of Type 2 diabetes. RPM provides structured postpartum monitoring that catches the transition from gestational to chronic disease.',
    metaDescription: 'RPM for OB-GYN practices monitoring gestational diabetes during pregnancy and postpartum glucose screening. Automated compliance documentation.',
    hero: 'Gestational diabetes doesn\'t end at delivery. RPM monitors what comes next.',
    valueProps: [
      { icon: 'pregnant_woman', title: 'Gestational diabetes monitoring', text: 'CGM during pregnancy provides real-time glucose data between OB visits — critical for insulin dose adjustments and dietary management.' },
      { icon: 'clinical_notes', title: 'Postpartum screening', text: '50% of women with GDM develop Type 2 diabetes within 10 years. RPM extends monitoring beyond the 6-week postpartum visit.' },
      { icon: 'receipt_long', title: 'Revenue during and after pregnancy', text: 'RPM codes apply during pregnancy (with a diabetes diagnosis) and during postpartum monitoring when pre-diabetes or Type 2 is diagnosed.' },
      { icon: 'verified', title: 'Coordinated care documentation', text: 'Share glucose data with MFM and endocrinology. Zayd\'s documentation supports care coordination across providers.' },
    ],
    faqs: [
      { question: 'Can I bill RPM for gestational diabetes during pregnancy?', answer: 'Yes, if the patient has a qualifying diagnosis and you\'re using an FDA-cleared monitoring device. Gestational diabetes (ICD-10 O24.4) qualifies. Check payer-specific rules — some require a pre-existing diabetes diagnosis for RPM coverage.' },
      { question: 'When should I start postpartum RPM monitoring?', answer: 'The ADA recommends glucose screening at 4-12 weeks postpartum for women with GDM. If pre-diabetes or diabetes is diagnosed, RPM can begin immediately. This is when most patients fall out of the healthcare system — RPM keeps them monitored.' },
      { question: 'How does RPM help with the postpartum follow-up gap?', answer: 'Only 50% of women with GDM complete postpartum glucose screening. RPM provides a structured reason for ongoing contact, a billable revenue stream, and continuous data that catches early Type 2 conversion.' },
    ],
    relatedSlugs: ['gestational-diabetes-glucose-monitoring', 'managing-diabetic-patients-between-visits', 'rpm-patient-enrollment-best-practices'],
  },
  {
    slug: 'geriatrics',
    name: 'Geriatrics',
    title: 'RPM for Geriatric Practices',
    description: 'Elderly diabetic patients face unique risks — polypharmacy, cognitive decline, hypoglycemia unawareness. RPM provides continuous monitoring that catches dangerous glucose excursions before they become emergencies.',
    metaDescription: 'RPM for geriatric practices monitoring elderly diabetic patients. Track glucose in patients with polypharmacy, cognitive decline, and hypoglycemia risk.',
    hero: 'Your most vulnerable patients need the closest monitoring.',
    valueProps: [
      { icon: 'elderly', title: 'Hypoglycemia prevention', text: 'Elderly patients are most at risk for severe hypoglycemia. CGM data alerts your team before glucose drops to dangerous levels.' },
      { icon: 'medication', title: 'Polypharmacy management', text: 'Multiple medications interact unpredictably with glucose. RPM data helps identify which drug changes cause metabolic disruption.' },
      { icon: 'receipt_long', title: 'RPM + CCM + TCM stacking', text: 'Geriatric patients often qualify for RPM, CCM, and Transitional Care Management codes. Multiple revenue streams from complex patients.' },
      { icon: 'verified', title: 'Caregiver engagement', text: 'Monthly RPM calls can include family caregivers — improving compliance and providing documentation of care coordination.' },
    ],
    faqs: [
      { question: 'How does RPM help with hypoglycemia in elderly patients?', answer: 'CGM data shows glucose trends, not just point-in-time readings. This catches overnight lows and post-meal spikes that fingerstick testing misses — critical in elderly patients who may not recognize hypoglycemia symptoms.' },
      { question: 'Can caregivers be involved in RPM calls?', answer: 'Yes. The monthly interactive contact can include a caregiver. This is especially valuable for patients with cognitive decline. Document who participated in the call for compliance purposes.' },
      { question: 'What about Medicare coverage for geriatric RPM?', answer: 'Medicare covers RPM under certain conditions. The patient must have a qualifying chronic condition, and the device must transmit data for 16+ days per month. Always verify coverage before enrollment.' },
    ],
    relatedSlugs: ['managing-diabetic-patients-between-visits', 'continuous-glucose-monitoring-rpm-guide', 'rpm-patient-compliance-strategies'],
  },
  {
    slug: 'pediatrics',
    name: 'Pediatrics',
    title: 'RPM for Pediatric Practices',
    description: 'Type 1 and early-onset Type 2 diabetes in children require close monitoring between visits. RPM gives pediatric practices continuous visibility into glucose trends — and billable documentation for the oversight these patients demand.',
    metaDescription: 'RPM for pediatric practices monitoring children with Type 1 and Type 2 diabetes. Continuous glucose tracking with automated compliance documentation.',
    hero: 'Young patients with diabetes need more than quarterly check-ins.',
    valueProps: [
      { icon: 'child_care', title: 'Continuous pediatric glucose monitoring', text: 'CGM data shows glucose patterns through school days, sports, and growth spurts — context you can\'t capture in an office visit.' },
      { icon: 'family_restroom', title: 'Parent and caregiver engagement', text: 'Monthly RPM calls include parents, improving compliance and creating a documented care partnership between visits.' },
      { icon: 'receipt_long', title: 'Bill for between-visit oversight', text: 'RPM codes reimburse for the monitoring time your team already spends reviewing pediatric glucose data and calling families.' },
      { icon: 'verified', title: 'Growth-adjusted monitoring', text: 'Document glucose trends during puberty, growth spurts, and activity changes — periods where insulin needs shift rapidly.' },
    ],
    faqs: [
      { question: 'Can pediatric practices bill RPM for children with diabetes?', answer: 'Yes. RPM billing applies to patients of any age with a qualifying chronic condition. Both Type 1 and Type 2 diabetes qualify. The same CPT codes (99457, 99458) apply. Parental consent is required for minors.' },
      { question: 'How does RPM work with school-age children?', answer: 'CGM devices transmit data automatically throughout the school day. Your team reviews the data and coordinates with parents during the monthly call. No action is needed from the child during school hours.' },
      { question: 'Is parental involvement required for RPM calls?', answer: 'For minors, a parent or legal guardian should participate in the monthly interactive contact. This actually improves compliance and gives you an opportunity to reinforce dietary and medication adherence with the family.' },
      { question: 'What about adolescents with new-onset Type 2 diabetes?', answer: 'Adolescent Type 2 diabetes is rising rapidly and often accompanies obesity and metabolic syndrome. RPM provides structured monitoring during the critical early management period when medication titration and lifestyle changes have the most impact.' },
    ],
    relatedSlugs: ['continuous-glucose-monitoring-rpm-guide', 'managing-diabetic-patients-between-visits', 'rpm-patient-enrollment-best-practices', 'rpm-patient-compliance-strategies'],
  },
]

export const FOOTER_SPECIALTIES = SPECIALTIES.slice(0, 5)
