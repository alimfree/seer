const INDUSTRY_AVERAGE_DENIAL_RATE = 15 // midpoint of the commonly cited 10-20% NEMT denial range
const TARGET_DENIAL_RATE = 5 // achievable benchmark with clean-claim submission and active denial management

interface CalculatorInput {
  trips: number
  reimbursement: number
  denialRate?: number
  email: string
}

interface RevenueBreakdown {
  trips: number
  reimbursement: number
  denialRate: number
  monthlyBilled: number
  annualBilled: number
  monthlyLostToDenials: number
  annualLostToDenials: number
  monthlyRecoverable: number
  annualRecoverable: number
}

export function calculateRevenue(input: CalculatorInput): RevenueBreakdown {
  const trips = input.trips
  const reimbursement = input.reimbursement
  const denialRate = input.denialRate && input.denialRate > 0 ? input.denialRate : INDUSTRY_AVERAGE_DENIAL_RATE

  const monthlyBilled = trips * reimbursement
  const annualBilled = monthlyBilled * 12

  const monthlyLostToDenials = monthlyBilled * (denialRate / 100)
  const annualLostToDenials = monthlyLostToDenials * 12

  const recoverableRate = Math.max(denialRate - TARGET_DENIAL_RATE, 0)
  const monthlyRecoverable = monthlyBilled * (recoverableRate / 100)
  const annualRecoverable = monthlyRecoverable * 12

  return {
    trips, reimbursement, denialRate,
    monthlyBilled, annualBilled,
    monthlyLostToDenials, annualLostToDenials,
    monthlyRecoverable, annualRecoverable,
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
  <title>Your NEMT Revenue Recovery Analysis — Seer Mobility</title>
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
                    <a href="https://www.seermobility.com" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;text-decoration:none;">Seer Mobility</a>
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
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 16px 0;">Your Revenue Recovery Analysis</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:16px;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6B8FA8;margin:0 0 8px 0;">Lost to Denials / Year</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${fmt(r.annualLostToDenials)}</p>
                  </td>
                  <td width="50%" style="padding-left:16px;border-left:1px solid rgba(107,143,168,0.3);">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#D4A96A;margin:0 0 8px 0;">Recoverable / Year</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${fmt(r.annualRecoverable)}</p>
                  </td>
                </tr>
              </table>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:16px 0 0 0;line-height:1.5;">
                Based on <strong style="color:#DDE2EE;">${r.trips.toLocaleString('en-US')} trips/month</strong> at ${fmtExact(r.reimbursement)}/trip and a ${r.denialRate}% denial rate
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Revenue Breakdown -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 24px 0;">Revenue Breakdown</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Monthly billed volume (${r.trips.toLocaleString('en-US')} trips)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.monthlyBilled)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Annual billed volume</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.annualBilled)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Lost to denials monthly, at ${r.denialRate}%</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.monthlyLostToDenials)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000B13;font-weight:600;padding:16px 0 0 0;">Recoverable annually at a ${TARGET_DENIAL_RATE}% benchmark</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#6B4A1F;font-weight:700;padding:16px 0 0 0;">${fmt(r.annualRecoverable)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Benchmark Explanation -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 8px 0;">How the ${TARGET_DENIAL_RATE}% benchmark works</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#72787c;margin:0 0 24px 0;">Industry-average NEMT denial rates run 10&ndash;20%. Operators with clean-claim submission and active denial management routinely bring that down toward ${TARGET_DENIAL_RATE}%.</p>

              <div style="padding:16px 20px;background-color:#EFF4FF;border-radius:4px;">
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.6;">
                  <strong style="color:#000B13;">Note:</strong> This projection is an estimate based on the trip volume, reimbursement rate, and denial rate you provided. Actual results depend on your broker mix, state Medicaid rules, and payer contracts.
                </p>
              </div>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- What Seer Mobility Handles -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 24px 0;">What Seer Mobility handles for you</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 16px 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">1</span>
                  </td>
                  <td style="padding:0 0 16px 0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Clean claim submission</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Automated pre-scrubbing against broker and payer rules before every submission.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 16px 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">2</span>
                  </td>
                  <td style="padding:0 0 16px 0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Active denial management</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Every denial triaged with a documented resolution path, resubmission, or appeal.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 0 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">3</span>
                  </td>
                  <td style="padding:0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Full revenue cycle oversight</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Real-time visibility into unbilled trips, aging AR, and broker performance.</p>
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
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;margin:0 0 24px 0;">We'll show you exactly how Seer Mobility fits into your current workflow.</p>
              <a href="https://seermobility.com/#contact" style="display:inline-block;background-color:#002434;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:2px;">Get in Touch</a>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#72787c;margin:0;line-height:1.6;">
                This revenue analysis is an estimate based on the figures you provided and industry-average NEMT denial rate benchmarks. It does not constitute financial or billing advice. Actual results vary by broker, state, and payer mix, and do not include Seer Mobility service fees.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;border-top:1px solid #EFF4FF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Seer Mobility</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0 0 4px 0;">NEMT Billing & Revenue Cycle Management</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                      <a href="https://www.seermobility.com" style="color:#6B4A1F;text-decoration:underline;">seermobility.com</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:hello@seermobility.com" style="color:#6B4A1F;text-decoration:underline;">hello@seermobility.com</a>
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
