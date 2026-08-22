const WEEKS_PER_MONTH = 4.33
const BOOKING_CONVERSION_RATE = 20 // % of answered after-hours calls that convert to a booked ride

interface CalculatorInput {
  missedCallsPerWeek: number
  avgTripValue: number
  fleetSize?: number
  email: string
}

interface RevenueBreakdown {
  missedCallsPerWeek: number
  avgTripValue: number
  fleetSize?: number
  monthlyMissedCalls: number
  monthlyRecoverableTrips: number
  monthlyRecoverable: number
  annualRecoverable: number
}

export function calculateRevenue(input: CalculatorInput): RevenueBreakdown {
  const { missedCallsPerWeek, avgTripValue, fleetSize } = input

  const monthlyMissedCalls = missedCallsPerWeek * WEEKS_PER_MONTH
  const monthlyRecoverableTrips = monthlyMissedCalls * (BOOKING_CONVERSION_RATE / 100)
  const monthlyRecoverable = monthlyRecoverableTrips * avgTripValue
  const annualRecoverable = monthlyRecoverable * 12

  return {
    missedCallsPerWeek, avgTripValue, fleetSize,
    monthlyMissedCalls, monthlyRecoverableTrips,
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
  <title>Your Missed-Call Revenue Analysis — Seer Mobility</title>
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
            <td style="background-color:#000B13;background:linear-gradient(135deg,#000B13,#002434);padding:48px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 16px 0;">Your Missed-Call Revenue Analysis</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:16px;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6B8FA8;margin:0 0 8px 0;">Missed Calls / Year</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${Math.round(r.monthlyMissedCalls * 12).toLocaleString('en-US')}</p>
                  </td>
                  <td width="50%" style="padding-left:16px;border-left:1px solid rgba(107,143,168,0.3);">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#D4A96A;margin:0 0 8px 0;">Recoverable / Year</p>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#F8F9FF;margin:0;line-height:1.2;">${fmt(r.annualRecoverable)}</p>
                  </td>
                </tr>
              </table>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:16px 0 0 0;line-height:1.5;">
                Based on <strong style="color:#DDE2EE;">${r.missedCallsPerWeek.toLocaleString('en-US')} missed calls/week</strong> at ${fmtExact(r.avgTripValue)}/trip and a ${BOOKING_CONVERSION_RATE}% booking conversion rate
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
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Missed calls/month (${r.missedCallsPerWeek}/week)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${Math.round(r.monthlyMissedCalls).toLocaleString('en-US')}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Recoverable rides/month, at ${BOOKING_CONVERSION_RATE}% conversion</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${Math.round(r.monthlyRecoverableTrips).toLocaleString('en-US')}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:12px 0;border-bottom:1px solid #EFF4FF;">Monthly recoverable revenue</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:12px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.monthlyRecoverable)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000B13;font-weight:600;padding:16px 0 0 0;">Recoverable annually</td>
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
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#000B13;margin:0 0 8px 0;">How this estimate works</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#5a5f63;margin:0 0 24px 0;">Fleets with an AI voice dispatcher typically answer and convert around ${BOOKING_CONVERSION_RATE}% of the after-hours calls that would otherwise go to voicemail.</p>

              <div style="padding:16px 20px;background-color:#EFF4FF;border-radius:4px;">
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.6;">
                  <strong style="color:#000B13;">Note:</strong> This projection is an estimate based on the missed-call volume and trip value you provided. Actual results depend on your service area, call mix, and conversion rate.
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
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Zero missed revenue</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Every after-hours and weekend call answered instantly, no voicemail, no callback delay.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 16px 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">2</span>
                  </td>
                  <td style="padding:0 0 16px 0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Warm dispatcher handoffs</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Complex edge cases get a live warm transfer to your team with full context.</p>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding:0 12px 0 0;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#4B3111;">3</span>
                  </td>
                  <td style="padding:0;">
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;margin:0 0 4px 0;font-weight:600;">Direct CAD synchronization</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:0;line-height:1.5;">Every booked ride is written straight into the dispatch system you already use.</p>
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
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0;line-height:1.6;">
                This revenue analysis is an estimate based on the figures you provided and a typical after-hours booking conversion rate. It does not constitute financial advice. Actual results vary by service area and call mix, and do not include Seer Mobility service fees.
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
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0 0 4px 0;">AI Voice Dispatch for NEMT Fleets</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0;">
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
