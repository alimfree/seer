// 2026 CMS Physician Fee Schedule national non-facility averages
const RATES = {
  '99453': 21.71,  // Initial setup and education (one-time)
  '99470': 26.05,  // Management, 10-19 min + live call (monthly)
  '99457': 51.77,  // Management, first 20 min + live call (monthly)
  '99458': 41.42,  // Each additional 20 min (monthly)
  '99490': 64.00,  // Standard CCM, 20 min/month
}

interface CalculatorInput {
  patients: number
  hours?: number
  email: string
}

interface RevenueBreakdown {
  patients: number
  hours: number
  // RPM only
  rpmMonthlyPerPatient: number
  rpmMonthly: number
  rpmAnnual: number
  // RPM + CCM stacked
  stackedMonthlyPerPatient: number
  stackedMonthly: number
  stackedAnnual: number
  // Shared
  setupOneTime: number
  rpmFirstYear: number
  stackedFirstYear: number
}

export function calculateRevenue(input: CalculatorInput): RevenueBreakdown {
  const patients = input.patients
  const hours = input.hours || 0

  // RPM only: 99457
  const rpmMonthlyPerPatient = RATES['99457']
  const rpmMonthly = rpmMonthlyPerPatient * patients
  const rpmAnnual = rpmMonthly * 12

  // RPM + CCM stacked: 99457 + 99490
  const stackedMonthlyPerPatient = RATES['99457'] + RATES['99490']
  const stackedMonthly = stackedMonthlyPerPatient * patients
  const stackedAnnual = stackedMonthly * 12

  // One-time setup: 99453 per patient
  const setupOneTime = RATES['99453'] * patients

  const rpmFirstYear = rpmAnnual + setupOneTime
  const stackedFirstYear = stackedAnnual + setupOneTime

  return {
    patients, hours,
    rpmMonthlyPerPatient, rpmMonthly, rpmAnnual,
    stackedMonthlyPerPatient, stackedMonthly, stackedAnnual,
    setupOneTime, rpmFirstYear, stackedFirstYear,
  }
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtExact(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

export function buildCalculatorEmail(input: CalculatorInput): string {
  const r = calculateRevenue(input)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your RPM Revenue Analysis — Zayd Health</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,sans-serif !important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Georgia,'Times New Roman',serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Main Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <a href="https://www.zaydhealth.com" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;text-decoration:none;">Zayd Health</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="width:48px;height:2px;background-color:#4B3111;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:linear-gradient(135deg,#000B13,#002434);padding:48px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 16px 0;">Your Revenue Analysis</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:16px;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6B8FA8;margin:0 0 8px 0;">RPM Only</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${fmt(r.rpmFirstYear)}</p>
                  </td>
                  <td width="50%" style="padding-left:16px;border-left:1px solid rgba(107,143,168,0.3);">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#D4A96A;margin:0 0 8px 0;">RPM + CCM Stacked</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${fmt(r.stackedFirstYear)}</p>
                  </td>
                </tr>
              </table>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:16px 0 0 0;line-height:1.5;">
                Estimated first-year revenue for <strong style="color:#DDE2EE;">${r.patients} patients</strong>
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Revenue Breakdown -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 24px 0;">Revenue Breakdown</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B8FA8;text-transform:uppercase;letter-spacing:1px;padding:0 0 12px 0;border-bottom:2px solid #EFF4FF;">&nbsp;
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B8FA8;text-transform:uppercase;letter-spacing:1px;padding:0 0 12px 0;border-bottom:2px solid #EFF4FF;">RPM Only</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B4A1F;text-transform:uppercase;letter-spacing:1px;padding:0 0 12px 0;border-bottom:2px solid #EFF4FF;">RPM + CCM</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Monthly per patient</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmtExact(r.rpmMonthlyPerPatient)}</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmtExact(r.stackedMonthlyPerPatient)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Monthly total (${r.patients} patients)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.rpmMonthly)}</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.stackedMonthly)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Annual recurring</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.rpmAnnual)}</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.stackedAnnual)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">One-time setup (99453)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;" colspan="2">${fmt(r.setupOneTime)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000B13;font-weight:600;padding:16px 0 0 0;">First-year total</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000B13;font-weight:700;padding:16px 0 0 0;">${fmt(r.rpmFirstYear)}</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#6B4A1F;font-weight:700;padding:16px 0 0 0;">${fmt(r.stackedFirstYear)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- CPT Rate Card -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 8px 0;">2026 CMS Rate Card</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#72787c;margin:0 0 24px 0;">National average reimbursement rates per the CY 2026 Physician Fee Schedule.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:2px solid #EFF4FF;">
                  <td style="font-family:'Courier New',monospace;font-size:12px;color:#6B8FA8;letter-spacing:1px;padding:10px 0;border-bottom:2px solid #EFF4FF;">CPT CODE</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B8FA8;text-transform:uppercase;letter-spacing:1px;padding:10px 0;border-bottom:2px solid #EFF4FF;">DESCRIPTION</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B8FA8;text-transform:uppercase;letter-spacing:1px;padding:10px 0;border-bottom:2px solid #EFF4FF;">RATE</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:13px;color:#000B13;padding:12px 0;border-bottom:1px solid #EFF4FF;">99453</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Initial setup &amp; education</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">$21.71</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:13px;color:#000B13;padding:12px 0;border-bottom:1px solid #EFF4FF;">99470</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Management, 10–19 min + live call</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">$26.05</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:13px;color:#000B13;padding:12px 0;border-bottom:1px solid #EFF4FF;">99457</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Management, first 20 min + live call</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">$51.77</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:13px;color:#000B13;padding:12px 0;border-bottom:1px solid #EFF4FF;">99458</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Each additional 20 min</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">$41.42</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:13px;color:#6B4A1F;padding:12px 0;">99490</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:12px 0;">Standard CCM, 20 min/month</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;font-weight:600;padding:12px 0;">$64.00</td>
                </tr>
              </table>

              <div style="margin-top:24px;padding:16px 20px;background-color:#EFF4FF;border-radius:4px;">
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.6;">
                  <strong style="color:#000B13;">Note:</strong> RPM-only uses 99457 as the monthly baseline. The stacked projection adds CCM (99490) for eligible patients with 2+ chronic conditions. Time for RPM and CCM must be tracked and documented separately.
                </p>
              </div>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- What Zayd Handles -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 24px 0;">What Zayd handles for you</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 16px 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">1</span>
                  </td>
                  <td style="padding:0 0 16px 0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Transmission tracking</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Automated verification that each patient meets the 16-day data transmission requirement for 99454.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 16px 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">2</span>
                  </td>
                  <td style="padding:0 0 16px 0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Clinical time logging</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Timestamped documentation of every patient interaction for 99457/99458 billing.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 0 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">3</span>
                  </td>
                  <td style="padding:0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Audit-ready superbills</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Generated monthly for your biller to submit. Every claim is backed by the documentation an auditor would ask for.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 0 40px 0;">
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Want to walk through your results?</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;margin:0 0 24px 0;">We'll show you exactly how Zayd fits into your current workflow.</p>
              <a href="https://calendly.com/ali-zaydhealth/discovery" style="display:inline-block;background-color:#002434;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:2px;">Schedule a Call</a>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#72787c;margin:0;line-height:1.6;">
                This revenue analysis is an estimate based on 2026 CMS national average reimbursement rates and does not constitute financial or medical billing advice. Actual reimbursement may vary by payer, locality, and claim adjudication. Figures do not include processing fees from your billing company, clearinghouse, or Zayd Health platform fees.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;border-top:1px solid #EFF4FF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Zayd Health</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0 0 4px 0;">RPM Billing Compliance Platform</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                      <a href="https://www.zaydhealth.com" style="color:#6B4A1F;text-decoration:underline;">zaydhealth.com</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:hello@zaydhealth.com" style="color:#6B4A1F;text-decoration:underline;">hello@zaydhealth.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
