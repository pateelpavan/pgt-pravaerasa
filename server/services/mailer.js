const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'pgtpaverasa3@gmail.com';
const rawPass = process.env.EMAIL_PASS || 'iujn vnmh fulq yfdo';
// Clean whitespace from app password
const EMAIL_PASS = rawPass.replace(/\s+/g, '');

const COMPANY_NAME = process.env.COMPANY_NAME || 'Paverasa Tech Growth';
const COMPANY_LEGAL_NAME = process.env.COMPANY_LEGAL_NAME || 'Paverasa Private Limited';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'Middletown, A504, Medchal, Telangana';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+91 7416472177';
const COMPANY_HOURS = process.env.COMPANY_HOURS || '24 Hours Operations';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Generate a dynamic anti-spam subject line
 * By rotating varied phrasing and appending unique reference codes and timestamps,
 * mail servers treat each message uniquely, preventing spam grouping and rate-limit heuristic blocks.
 */
function generateAntiSpamSubject({ clientName, company, projectName, installmentNumber, dueDate, amount }) {
  const refId = `PTG-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const amountStr = `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const subjectTemplates = [
    `Payment Notice: Milestone #${installmentNumber} (${amountStr}) for ${company} [Ref: ${refId}]`,
    `Important: Upcoming Milestone Due Date (${dueDate}) - ${projectName} #${refId}`,
    `Statement & Milestone Invoice for ${clientName} | ${COMPANY_NAME} (${refId})`,
    `Notice of Milestone EMI Schedule: ${company} - ${amountStr} Due [${refId}]`,
    `Billing Advisory for ${projectName}: Milestone #${installmentNumber} [Ref #${refId}]`,
    `Milestone Payment Advisory (${dateStr}) - ${company} [Ref: ${refId}]`,
    `Action Required: Milestone Payment Notice for ${projectName} [Ticket: ${refId}]`,
    `${COMPANY_NAME} Statement: Installment #${installmentNumber} for ${company} [${refId}]`
  ];

  const subject = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
  return { subject, refId };
}

/**
 * Build the branded HTML email template
 */
function buildPaymentDueHtml({
  clientName,
  company,
  projectName,
  installmentNumber,
  amount,
  dueDate,
  status,
  totalAmount,
  amountPaid,
  balance,
  refId,
  portalUrl,
  customNote
}) {
  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');
  const formattedTotal = Number(totalAmount || 0).toLocaleString('en-IN');
  const formattedPaid = Number(amountPaid || 0).toLocaleString('en-IN');
  const formattedBalance = Number(balance || 0).toLocaleString('en-IN');
  const isOverdue = status === 'Overdue';
  const statusColor = isOverdue ? '#dc2626' : '#ea580c';
  const statusBg = isOverdue ? '#fef2f2' : '#fff7ed';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Due Notice</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .container { max-width: 620px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #f59e0b 100%); padding: 36px 32px; text-align: left; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #fed7aa; font-size: 13px; font-weight: 500; }
    .badge { display: inline-block; background-color: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.5px; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .intro { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .due-hero { background-color: ${statusBg}; border: 1.5px solid ${statusColor}; border-radius: 16px; padding: 22px; text-align: center; margin-bottom: 24px; }
    .due-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: ${statusColor}; letter-spacing: 0.5px; }
    .due-amount { font-size: 34px; font-weight: 900; color: #0f172a; margin: 6px 0; }
    .due-date { font-size: 13px; font-weight: 600; color: #475569; }
    .table-details { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    .table-details td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .table-details td.label { color: #64748b; font-weight: 500; }
    .table-details td.value { color: #0f172a; font-weight: 700; text-align: right; }
    .note-box { background-color: #fefce8; border-left: 4px solid #eab308; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #713f12; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 32px 0 16px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #ea580c, #f97316); color: #ffffff !important; padding: 14px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35); }
    .info-footer { padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6; }
    .info-footer strong { color: #334155; }
    .ref-tag { font-family: monospace; font-size: 11px; color: #94a3b8; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">PTG • OFFICIAL NOTIFICATION</div>
      <h1>${COMPANY_NAME}</h1>
      <p>A brand of ${COMPANY_LEGAL_NAME}</p>
    </div>

    <div class="content">
      <div class="greeting">Dear ${clientName || 'Valued Client'},</div>
      <div class="intro">
        We hope you are satisfied with the continued execution and velocity on your project <strong>${projectName || 'Digital Initiative'}</strong>. 
        This is an official statement regarding the upcoming milestone installment under your agreed project EMI schedule.
      </div>

      <div class="due-hero">
        <div class="due-label">${isOverdue ? 'Overdue Installment' : 'Milestone Payment Due'} • Installment #${installmentNumber || 1}</div>
        <div class="due-amount">₹${formattedAmount}</div>
        <div class="due-date">Due on or before: <strong>${dueDate || 'Immediate'}</strong> &nbsp;|&nbsp; Status: <span style="color: ${statusColor}; font-weight: 800;">${status || 'Pending'}</span></div>
      </div>

      <div class="card">
        <div style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Account & Project Statement</div>
        <table class="table-details">
          <tr>
            <td class="label">Client Organization:</td>
            <td class="value">${company || 'Client'}</td>
          </tr>
          <tr>
            <td class="label">Assigned Project:</td>
            <td class="value">${projectName || 'Active Sprint'}</td>
          </tr>
          <tr>
            <td class="label">Total Project Contract:</td>
            <td class="value">₹${formattedTotal}</td>
          </tr>
          <tr>
            <td class="label">Amount Settled to Date:</td>
            <td class="value" style="color: #16a34a;">₹${formattedPaid}</td>
          </tr>
          <tr>
            <td class="label">Remaining Project Balance:</td>
            <td class="value" style="color: #ea580c;">₹${formattedBalance}</td>
          </tr>
        </table>
      </div>

      ${customNote ? `
      <div class="note-box">
        <strong>Special Administrative Note:</strong><br>
        ${customNote}
      </div>` : ''}

      <div class="btn-container">
        <a href="${portalUrl || 'http://localhost:5000/login'}" class="btn">View Live Project Dashboard & Invoices →</a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px; text-align: center;">
        Payment modes: NEFT / RTGS, Corporate UPI, and Direct Bank Transfer. Detailed bank credentials can be accessed in your secure dashboard.
      </p>
    </div>

    <div class="info-footer">
      <strong>${COMPANY_LEGAL_NAME}</strong> • Headquarters<br>
      ${COMPANY_ADDRESS}<br>
      Email: <a href="mailto:${EMAIL_USER}" style="color: #ea580c; text-decoration: none;">${EMAIL_USER}</a> &nbsp;|&nbsp; 
      Phone: <a href="tel:${COMPANY_PHONE}" style="color: #ea580c; text-decoration: none;">${COMPANY_PHONE}</a><br>
      <strong>Operational Hours: ${COMPANY_HOURS}</strong> (Round-the-clock client support)<br>
      <div class="ref-tag">Tracking ID: ${refId} • Generated: ${new Date().toISOString()}</div>
      <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
        © 2026 Paverasa Private Limited. All Rights Reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send Payment Due Reminder Email
 */
async function sendPaymentDueReminder({
  clientEmail,
  clientName,
  company,
  projectName,
  installmentNumber,
  amount,
  dueDate,
  status,
  totalAmount,
  amountPaid,
  balance,
  portalUrl,
  customNote
}) {
  if (!clientEmail) {
    throw new Error('Recipient client email is required.');
  }

  // 1. Generate unique Anti-Spam Subject and reference ID
  const { subject, refId } = generateAntiSpamSubject({
    clientName,
    company,
    projectName,
    installmentNumber,
    dueDate,
    amount
  });

  // 2. Build HTML Body
  const htmlContent = buildPaymentDueHtml({
    clientName,
    company,
    projectName,
    installmentNumber,
    amount,
    dueDate,
    status,
    totalAmount,
    amountPaid,
    balance,
    refId,
    portalUrl,
    customNote
  });

  // 3. Plain text fallback for high deliverability & anti-spam compliance
  const textContent = `
${COMPANY_NAME} - A brand of ${COMPANY_LEGAL_NAME}
Official Payment Statement Notice [Ref: ${refId}]

Dear ${clientName || 'Valued Client'} (${company || 'Client'}),

This is an official milestone payment reminder for your ongoing project "${projectName || 'Digital Initiative'}".

Milestone Installment #${installmentNumber || 1}
Amount Due: ₹${Number(amount || 0).toLocaleString('en-IN')}
Due Date: ${dueDate || 'Immediate'}
Status: ${status || 'Pending'}

Project Financial Summary:
- Total Contract: ₹${Number(totalAmount || 0).toLocaleString('en-IN')}
- Amount Paid: ₹${Number(amountPaid || 0).toLocaleString('en-IN')}
- Remaining Balance: ₹${Number(balance || 0).toLocaleString('en-IN')}

Access your Client Portal to review deliverables and payment invoices:
${portalUrl || 'http://localhost:5000/login'}

Office Address: ${COMPANY_ADDRESS}
Support Email: ${EMAIL_USER}
Support Phone: ${COMPANY_PHONE}
Operational Hours: ${COMPANY_HOURS}

© 2026 Paverasa Private Limited. All Rights Reserved.
`.trim();

  const mailOptions = {
    from: `"${COMPANY_NAME}" <${EMAIL_USER}>`,
    to: clientEmail,
    replyTo: EMAIL_USER,
    subject: subject,
    text: textContent,
    html: htmlContent,
    headers: {
      'X-Entity-Ref-ID': refId,
      'X-Mailer': 'Paverasa-Tech-Growth-Mailer/2026',
      'List-Unsubscribe': `<mailto:${EMAIL_USER}?subject=unsubscribe>`
    }
  };

  const info = await transporter.sendMail(mailOptions);
  return {
    success: true,
    messageId: info.messageId,
    subject: subject,
    refId: refId,
    recipient: clientEmail
  };
}

module.exports = {
  transporter,
  sendPaymentDueReminder,
  generateAntiSpamSubject,
  COMPANY_NAME,
  COMPANY_LEGAL_NAME,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_HOURS,
  EMAIL_USER
};
