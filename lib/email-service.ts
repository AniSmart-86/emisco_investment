import { Resend } from 'resend';
import prisma from './prisma';
import { Order, OrderItem } from './types';
import { EMISCO_OFFICE_ADDRESS } from './logistics-data';

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com';
const EMISCO_LOGO = `${SITE_URL}/emisco_logo.png`;
const FROM_EMAIL = "Emisco Investment Ltd <noreply@emiscoinvestment.com>";
const ADMIN_EMAIL = process.env.SMTP_USER || "michaely@emiscoinvestment.com";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  darkGreen: "#0D3121",
  pureGreen: "#10b981",
  lightGreen: "#d1fae5",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  red: "#ef4444",
  text: "#1a202c",
  muted: "#718096",
  border: "#e2e8f0",
  bg: "#f8fafc",
  white: "#ffffff",
};

// ─── SHARED RESPONSIVE LAYOUT ────────────────────────────────────────────────
function buildEmailWrapper(content: string, previewText: string = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Emisco Investment Ltd</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-outer-td { padding: 12px 6px !important; }
      .email-card { border-radius: 16px !important; }
      .responsive-cell { padding-left: 18px !important; padding-right: 18px !important; }
      .responsive-header { padding: 20px 16px !important; }
      .responsive-footer { padding: 20px 16px !important; }
      .mobile-text-lg { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${COLORS.bg};min-height:100vh;">
    <tr>
      <td align="center" class="email-outer-td" style="padding:24px 12px;">
        
        <!-- EMAIL CARD CONTAINER (Max Width 600px for perfectly balanced width) -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-card" style="width:100%;max-width:600px;margin:0 auto;background:${COLORS.white};border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid ${COLORS.border};">
          
          <!-- HEADER -->
          <tr>
            <td class="responsive-header" style="background:linear-gradient(135deg,${COLORS.darkGreen} 0%,#1a5c3a 100%);padding:24px 20px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.14);padding:8px 14px;border-radius:14px;margin-bottom:12px;">
                <img src="${EMISCO_LOGO}" alt="Emisco Investment Ltd" style="max-height:44px;width:auto;max-width:180px;display:block;margin:0 auto;border-radius:6px;" />
              </div>
              <h1 style="color:${COLORS.white};margin:0;font-size:20px;font-weight:800;letter-spacing:-0.3px;">EMISCO INVESTMENT LTD</h1>
              <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:12px;letter-spacing:0.5px;">Heavy Duty Truck Parts & Machinery Specialist</p>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          ${content}

          <!-- FOOTER -->
          <tr>
            <td class="responsive-footer" style="background:${COLORS.bg};padding:24px 24px;text-align:center;border-top:1px solid ${COLORS.border};">
              <p style="margin:0 0 8px;font-size:12px;color:${COLORS.muted};line-height:1.5;">
                <strong style="color:${COLORS.text};">Emisco Investment Ltd</strong><br/>
                ${EMISCO_OFFICE_ADDRESS}
              </p>
              <p style="margin:0;font-size:11px;color:#a0aec0;line-height:1.5;">
                Mon – Sat &nbsp;|&nbsp; 8:00 AM – 5:00 PM
                &nbsp;&nbsp;·&nbsp;&nbsp;
                Automated notification. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
        <!-- END EMAIL CARD -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── BADGE COMPONENT ─────────────────────────────────────────────────────────
function statusBadge(label: string, color: string, bg: string) {
  return `<span style="display:inline-block;padding:5px 14px;border-radius:100px;background:${bg};color:${color};font-size:11px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;">${label}</span>`;
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
const divider = `<tr><td class="responsive-cell" style="padding:0 24px;"><div style="height:1px;background:${COLORS.border};"></div></td></tr>`;

// ─── ORDER ITEMS TABLE ────────────────────────────────────────────────────────
function buildItemsRows(orderItems: OrderItem[]): string {
  return orderItems.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td style="width:50px;vertical-align:middle;">
              ${item.productImage
                ? `<img src="${item.productImage}" alt="${item.productName}" width="46" height="46" style="border-radius:8px;object-fit:cover;display:block;" />`
                : `<div style="width:46px;height:46px;border-radius:8px;background:${COLORS.lightGreen};"></div>`
              }
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:${COLORS.text};">${item.productName || 'Part'}</p>
              <p style="margin:0;font-size:11px;color:${COLORS.muted};">Qty: ${item.quantity}</p>
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <p style="margin:0;font-size:13px;font-weight:800;color:${COLORS.text};">₦${(item.price * item.quantity).toLocaleString()}</p>
              <p style="margin:0;font-size:10px;color:${COLORS.muted};">₦${item.price.toLocaleString()} each</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');
}

// ─── INFO ROW ────────────────────────────────────────────────────────────────
function infoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.border};">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td style="font-size:11px;color:${COLORS.muted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
            <td style="font-size:13px;color:${COLORS.text};font-weight:700;text-align:right;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}


// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTED EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sends a delayed order notification if the payment is still pending.
 */
export async function sendOrderNotificationWithSync(orderId: string, delayMs: number = 60000) {
  console.log(`Email Sync: Waiting ${delayMs}ms before checking order #${orderId}...`);

  setTimeout(async () => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, orderItems: true },
      });

      if (!order) return;

      const type = order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING';
      await sendOrderNotification(orderId, type, order);
    } catch (error) {
      console.error('Email Sync Error:', error);
    }
  }, delayMs);
}


/**
 * Core order notification — supports both PENDING and PAID states.
 */
export async function sendOrderNotification(orderId: string, type: 'PENDING' | 'PAID', preloadedOrder?: any) {
  try {
    const order = preloadedOrder || await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, orderItems: true },
    });

    if (!order || !order.user || !order.user.email || !order.orderItems) return;

    const isPaid = type === 'PAID';
    const shortId = order.id.slice(0, 8).toUpperCase();
    const subject = isPaid
      ? `✅ Order Confirmed — #${shortId}`
      : `📦 Order Received — #${shortId}`;

    const statusColor = isPaid ? COLORS.pureGreen : COLORS.amber;
    const statusBg = isPaid ? COLORS.lightGreen : "#fef3c7";
    const statusLabel = isPaid ? '✓ Payment Confirmed' : '⏳ Payment Pending';

    const itemsHtml = buildItemsRows(order.orderItems as OrderItem[]);

    const isPickup = order.deliveryMethod === 'pickup';
    const deliverySection = isPickup ? `
      <tr>
        <td class="responsive-cell" style="padding:20px 24px 0;">
          <div style="background:${COLORS.lightGreen};border-radius:14px;padding:16px;border:1px solid ${COLORS.pureGreen}30;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.pureGreen};">🏢 Store Pick-up Location</p>
            <p style="margin:0;font-size:13px;color:${COLORS.text};font-weight:700;line-height:1.4;">${EMISCO_OFFICE_ADDRESS}</p>
            <p style="margin:6px 0 0;font-size:11px;color:${COLORS.muted};"><strong>Working Hours:</strong> Mon – Sat, 8:00 AM – 5:00 PM</p>
            <p style="margin:4px 0 0;font-size:11px;color:${COLORS.pureGreen};font-weight:700;"> Present Order Reference #${shortId} upon collection.</p>
          </div>
        </td>
      </tr>
    ` : order.shippingAddress ? `
      <tr>
        <td class="responsive-cell" style="padding:20px 24px 0;">
          <div style="background:${COLORS.bg};border-radius:14px;padding:16px;border:1px solid ${COLORS.border};">
            <p style="margin:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">🚚 Home / Doorstep Delivery</p>
            <p style="margin:0;font-size:13px;color:${COLORS.text};font-weight:600;line-height:1.4;">${order.shippingAddress}</p>
            ${order.nearestBusStop ? `<p style="margin:4px 0 0;font-size:11px;color:${COLORS.muted};">🚏 <strong>Nearest Bus Stop:</strong> ${order.nearestBusStop}</p>` : ''}
            <p style="margin:8px 0 0;font-size:11px;color:${COLORS.amber};font-weight:700;background:#fffbeb;padding:6px 10px;border-radius:6px;border:1px solid ${COLORS.amber}30;">📞 Our logistics team will call you shortly regarding delivery charges.</p>
          </div>
        </td>
      </tr>
    ` : '';

    const ctaUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`;

    const bodyContent = `
      <!-- STATUS BANNER -->
      <tr>
        <td class="responsive-cell" style="padding:24px 24px 0;text-align:center;">
          ${statusBadge(statusLabel, statusColor, statusBg)}
          <h2 class="mobile-text-lg" style="margin:14px 0 6px;font-size:22px;font-weight:800;color:${COLORS.text};">
            ${isPaid ? 'Payment Received!' : 'Order Received'}
          </h2>
          <p style="margin:0;font-size:13px;color:${COLORS.muted};line-height:1.5;">
            Hi <strong>${order.user.name}</strong>, ${isPaid
              ? 'your payment was successful and your order has been confirmed.'
              : 'we received your order. Complete payment to proceed with fulfilment.'}
          </p>
        </td>
      </tr>

      <!-- ORDER ID BOX -->
      <tr>
        <td class="responsive-cell" style="padding:16px 24px 0;">
          <div style="background:${COLORS.darkGreen};border-radius:14px;padding:16px;text-align:center;">
            <p style="margin:0 0 2px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.6);">Order Reference</p>
            <p style="margin:0;font-size:18px;font-weight:900;color:${COLORS.white};letter-spacing:2px;font-family:monospace;">#${shortId}</p>
          </div>
        </td>
      </tr>

      ${deliverySection}

      <!-- ITEMS -->
      <tr>
        <td class="responsive-cell" style="padding:20px 24px 0;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Items Ordered</p>
          <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
            ${itemsHtml}
          </table>
        </td>
      </tr>

      <!-- TOTAL -->
      <tr>
        <td class="responsive-cell" style="padding:16px 24px 24px;">
          <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
            <tr>
              <td style="font-size:14px;font-weight:700;color:${COLORS.text};">Total Amount</td>
              <td style="font-size:20px;font-weight:900;color:${COLORS.pureGreen};text-align:right;">₦${order.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
        </td>
      </tr>

      ${divider}

      <!-- CTA BUTTON -->
      <tr>
        <td class="responsive-cell" style="padding:24px 24px;text-align:center;">
          <a href="${ctaUrl}" style="display:inline-block;background:${COLORS.pureGreen};color:${COLORS.white};text-decoration:none;font-size:13px;font-weight:800;padding:14px 30px;border-radius:100px;letter-spacing:0.5px;">
            View Order Details →
          </a>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.user.email],
      subject,
      html: buildEmailWrapper(bodyContent, isPaid ? `Your payment for order #${shortId} was successful.` : `We received your order #${shortId}.`),
    });

    console.log(`✅ Resend: Order notification (${type}) sent to ${order.user.email}`);
  } catch (error) {
    console.error('❌ Resend Email Error (sendOrderNotification):', error);
  }
}


/**
 * Sends a delivery status update email to the customer.
 */
export async function sendDeliveryStatusUpdateEmail(orderId: string, status: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order || !order.user || !order.user.email) return;

    const shortId = order.id.slice(0, 8).toUpperCase();

    const statusConfig: Record<string, { color: string; bg: string; icon: string; title: string; message: string }> = {
      PROCESSING: { color: COLORS.blue, bg: '#eff6ff', icon: '⚙️', title: 'Order is Being Processed', message: "We're preparing your order for dispatch." },
      SHIPPED:    { color: COLORS.purple, bg: '#f5f3ff', icon: '🚚', title: 'Your Order Has Shipped!', message: "Your parts are on their way." },
      OUT_FOR_DELIVERY: { color: COLORS.amber, bg: '#fffbeb', icon: '📦', title: 'Out for Delivery!', message: "Your order is out for delivery." },
      DELIVERED:  { color: COLORS.pureGreen, bg: COLORS.lightGreen, icon: '✅', title: 'Order Delivered!', message: "Your order has been successfully delivered." },
    };

    const cfg = statusConfig[status] || { color: COLORS.darkGreen, bg: COLORS.bg, icon: '📋', title: `Status: ${status.replace(/_/g, ' ')}`, message: 'Your order status has been updated.' };

    const bodyContent = `
      <!-- ICON + STATUS -->
      <tr>
        <td class="responsive-cell" style="padding:28px 24px 20px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;line-height:1;">${cfg.icon}</div>
          ${statusBadge(status.replace(/_/g, ' '), cfg.color, cfg.bg)}
          <h2 class="mobile-text-lg" style="margin:14px 0 6px;font-size:22px;font-weight:800;color:${COLORS.text};">${cfg.title}</h2>
          <p style="margin:0;font-size:13px;color:${COLORS.muted};line-height:1.5;">
            Hi <strong>${order.user.name}</strong>, ${cfg.message}
          </p>
        </td>
      </tr>

      <!-- ORDER REFERENCE -->
      <tr>
        <td class="responsive-cell" style="padding:0 24px 20px;">
          <div style="background:${COLORS.bg};border-radius:12px;padding:14px;border:1px solid ${COLORS.border};text-align:center;">
            <p style="margin:0 0 2px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Order Reference</p>
            <p style="margin:0;font-size:16px;font-weight:900;color:${COLORS.text};font-family:monospace;">#${shortId}</p>
          </div>
        </td>
      </tr>

      ${divider}

      <!-- CTA -->
      <tr>
        <td class="responsive-cell" style="padding:24px 24px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}" style="display:inline-block;background:${COLORS.darkGreen};color:${COLORS.white};text-decoration:none;font-size:13px;font-weight:800;padding:14px 30px;border-radius:100px;">
            Track My Order →
          </a>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.user.email],
      subject: `${cfg.icon} ${cfg.title} — Order #${shortId}`,
      html: buildEmailWrapper(bodyContent, `${cfg.message} Order #${shortId}`),
    });

    console.log(` Resend: Status update (${status}) sent to ${order.user.email}`);
  } catch (error) {
    console.error(' Resend Email Error (sendDeliveryStatusUpdateEmail):', error);
  }
}


/**
 * Sends contact form feedback to the admin inbox.
 */
export async function sendContactFeedbackEmail(data: { name: string; email: string; phone: string; message: string }) {
  try {
    const bodyContent = `
      <!-- HEADER TEXT -->
      <tr>
        <td class="responsive-cell" style="padding:24px 24px 20px;text-align:center;">
          <div style="font-size:42px;margin-bottom:10px;">💬</div>
          <h2 style="margin:0 0 6px;font-size:20px;font-weight:800;color:${COLORS.text};">New Customer Message</h2>
          <p style="margin:0;font-size:13px;color:${COLORS.muted};">Someone reached out via the Emisco contact form.</p>
        </td>
      </tr>

      <!-- CUSTOMER DETAILS CARD -->
      <tr>
        <td class="responsive-cell" style="padding:0 24px 20px;">
          <div style="background:${COLORS.bg};border-radius:14px;padding:18px;border:1px solid ${COLORS.border};">
            <p style="margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Customer Details</p>
            <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
              ${infoRow('Name', data.name)}
              ${infoRow('Email', data.email)}
              ${infoRow('Phone', data.phone)}
            </table>
          </div>
        </td>
      </tr>

      <!-- MESSAGE CONTENT -->
      <tr>
        <td class="responsive-cell" style="padding:0 24px 24px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Message</p>
          <div style="background:#fffbf0;border-left:4px solid ${COLORS.amber};border-radius:0 10px 10px 0;padding:16px 18px;">
            <p style="margin:0;font-size:13px;color:${COLORS.text};line-height:1.6;font-style:italic;">"${data.message}"</p>
          </div>
        </td>
      </tr>

      ${divider}

      <!-- REPLY CTA -->
      <tr>
        <td class="responsive-cell" style="padding:20px 24px;text-align:center;">
          <a href="mailto:${data.email}" style="display:inline-block;background:${COLORS.pureGreen};color:${COLORS.white};text-decoration:none;font-size:13px;font-weight:800;padding:12px 28px;border-radius:100px;">
            Reply to ${data.name} →
          </a>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: data.email,
      subject: `New Customer Message from ${data.name}`,
      html: buildEmailWrapper(bodyContent, `${data.name} sent a message: "${data.message.slice(0, 80)}..."`),
    });

    console.log(`Resend: Contact feedback email sent from ${data.email}`);
  } catch (error) {
    console.error('Resend Email Error (sendContactFeedbackEmail):', error);
    throw error;
  }
}


/**
 * Sends a professional Welcome Email to newly registered users.
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const shopUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com'}/products`;

    const bodyContent = `
      <!-- WELCOME HERO BANNER -->
      <tr>
        <td class="responsive-cell" style="padding:28px 24px 20px;text-align:center;">
        
          ${statusBadge('WELCOME TO EMISCO', COLORS.pureGreen, COLORS.lightGreen)}
          <h2 class="mobile-text-lg" style="margin:16px 0 8px;font-size:22px;font-weight:800;color:${COLORS.text};">Welcome aboard, ${name}!</h2>
          <p style="margin:0;font-size:13px;color:${COLORS.muted};line-height:1.6;max-width:440px;margin-left:auto;margin-right:auto;">
            Thank you for creating an account with <strong>Emisco Investment Limited</strong>. Your one-stop shop for genuine motor parts, truck accessories, and heavy machinery components.
          </p>
        </td>
      </tr>

      <!-- FEATURES CARD -->
      <tr>
        <td class="responsive-cell" style="padding:0 24px 24px;">
          <div style="background:${COLORS.bg};border-radius:16px;padding:18px;border:1px solid ${COLORS.border};">
            <p style="margin:0 0 12px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Why Choose Emisco?</p>
            <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${COLORS.border};">
                  <span style="font-size:16px;margin-right:8px;">💯</span>
                  <strong style="font-size:12px;color:${COLORS.text};">100% Genuine OEM Parts</strong>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${COLORS.border};">
                  <span style="font-size:16px;margin-right:8px;">🚚</span>
                  <strong style="font-size:12px;color:${COLORS.text};">Fast Pick-up & Delivery Options</strong>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;">
                  <span style="font-size:16px;margin-right:8px;">📞</span>
                  <strong style="font-size:12px;color:${COLORS.text};">Dedicated Customer Support</strong>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      ${divider}

      <!-- CTA BUTTON -->
      <tr>
        <td class="responsive-cell" style="padding:24px 24px;text-align:center;">
          <a href="${shopUrl}" style="display:inline-block;background:${COLORS.pureGreen};color:${COLORS.white};text-decoration:none;font-size:14px;font-weight:800;padding:14px 32px;border-radius:100px;letter-spacing:0.5px;">
            Start Exploring Parts →
          </a>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: ` Welcome to Emisco Investment Limited, ${name}!`,
      html: buildEmailWrapper(bodyContent, `Welcome to Emisco Investment Limited, ${name}! Start exploring genuine motor parts today.`),
    });

    console.log(` Resend: Welcome email sent to ${email}`);
  } catch (error) {
    console.error(' Resend Email Error (sendWelcomeEmail):', error);
  }
}


/**
 * Sends a 6-Digit Password Reset OTP Email.
 */
export async function sendPasswordResetOtpEmail(email: string, name: string, otp: string) {
  try {
    const bodyContent = `
      <!-- LOCK ICON & HEADER -->
      <tr>
        <td class="responsive-cell" style="padding:28px 24px 16px;text-align:center;">
          <div style="font-size:46px;margin-bottom:10px;line-height:1;">🔐</div>
          ${statusBadge('SECURITY VERIFICATION', COLORS.amber, '#fffbeb')}
          <h2 class="mobile-text-lg" style="margin:14px 0 6px;font-size:22px;font-weight:800;color:${COLORS.text};">Password Reset Code</h2>
          <p style="margin:0;font-size:13px;color:${COLORS.muted};line-height:1.5;">
            Hi <strong>${name}</strong>, we received a request to reset your password for your Emisco account.
          </p>
        </td>
      </tr>

      <!-- OTP DISPLAY BOX -->
      <tr>
        <td class="responsive-cell" style="padding:16px 24px;">
          <div style="background:${COLORS.darkGreen};border-radius:16px;padding:24px 16px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.6);">Your 6-Digit Verification OTP</p>
            <div style="font-size:32px;font-weight:900;color:${COLORS.white};letter-spacing:8px;font-family:monospace;margin:10px 0;">${otp}</div>
            <p style="margin:6px 0 0;font-size:11px;color:#86efac;font-weight:600;">⏰ Expires in 20 minutes</p>
          </div>
        </td>
      </tr>

      <!-- WARNING BOX -->
      <tr>
        <td class="responsive-cell" style="padding:12px 24px 20px;">
          <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;padding:12px 14px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#be123c;line-height:1.4;">
              <strong>Did not request this?</strong> Please ignore this email or contact support if you suspect unauthorized access.
            </p>
          </div>
        </td>
      </tr>

      ${divider}

      <tr>
        <td class="responsive-cell" style="font-size:11px;color:${COLORS.muted};padding:20px 24px;text-align:center;">
          If you have trouble entering the code, please return to the website and select "Resend Code".
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `${otp} is your Emisco password reset code`,
      html: buildEmailWrapper(bodyContent, `Your password reset code is ${otp}. Valid for 20 minutes.`),
    });

    console.log(`Resend: Password reset OTP email sent to ${email}`);
  } catch (error) {
    console.error('Resend Email Error (sendPasswordResetOtpEmail):', error);
    throw error;
  }
}
