import { Resend } from 'resend';
import prisma from './prisma';
import { Order, OrderItem } from './types';
import { EMISCO_OFFICE_ADDRESS } from './logistics-data';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMISCO_LOGO = "https://res.cloudinary.com/dupdplmls/image/upload/v1774946745/l5kle05zlyyu08qo5cyy.jpg";
const FROM_EMAIL = "Emisco Investment Ltd <support@emiscoinvestment.com>"; // Update to your verified domain
const ADMIN_EMAIL = process.env.SMTP_USER || "anismart124@gmail.com";

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

// ─── SHARED LAYOUT ────────────────────────────────────────────────────────────
function buildEmailWrapper(content: string, previewText: string = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Emisco Investment Ltd</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preview text hack -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${COLORS.bg};min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        
        <!-- EMAIL CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:${COLORS.white};border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.08);border:1px solid ${COLORS.border};">
          
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${COLORS.darkGreen} 0%,#1a5c3a 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.12);padding:10px;border-radius:16px;margin-bottom:16px;">
                <img src="${EMISCO_LOGO}" alt="Emisco" width="48" height="48" style="display:block;border-radius:10px;" />
              </div>
              <h1 style="color:${COLORS.white};margin:0;font-size:22px;font-weight:800;letter-spacing:-0.3px;">EMISCO INVESTMENT LTD</h1>
              <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;letter-spacing:0.5px;">Premium Truck Spare Parts</p>
            </td>
          </tr>

          <!-- BODY -->
          ${content}

          <!-- FOOTER -->
          <tr>
            <td style="background:${COLORS.bg};padding:28px 40px;text-align:center;border-top:1px solid ${COLORS.border};">
              <p style="margin:0 0 8px;font-size:12px;color:${COLORS.muted};">
                <strong style="color:${COLORS.text};">Emisco Investment Ltd</strong><br/>
                ${EMISCO_OFFICE_ADDRESS}
              </p>
              <p style="margin:0;font-size:11px;color:#a0aec0;">
                Mon – Sat &nbsp;|&nbsp; 8:00 AM – 5:00 PM
                &nbsp;&nbsp;·&nbsp;&nbsp;
                This email was sent from our automated system. Please do not reply directly.
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
  return `<span style="display:inline-block;padding:6px 16px;border-radius:100px;background:${bg};color:${color};font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">${label}</span>`;
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
const divider = `<tr><td style="padding:0 40px;"><div style="height:1px;background:${COLORS.border};"></div></td></tr>`;

// ─── ORDER ITEMS TABLE ────────────────────────────────────────────────────────
function buildItemsRows(orderItems: OrderItem[]): string {
  return orderItems.map(item => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${COLORS.border};">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td style="width:56px;vertical-align:middle;">
              ${item.productImage
                ? `<img src="${item.productImage}" alt="${item.productName}" width="52" height="52" style="border-radius:10px;object-fit:cover;display:block;" />`
                : `<div style="width:52px;height:52px;border-radius:10px;background:${COLORS.lightGreen};"></div>`
              }
            </td>
            <td style="padding-left:14px;vertical-align:middle;">
              <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:${COLORS.text};">${item.productName || 'Part'}</p>
              <p style="margin:0;font-size:12px;color:${COLORS.muted};">Qty: ${item.quantity}</p>
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <p style="margin:0;font-size:14px;font-weight:800;color:${COLORS.text};">₦${(item.price * item.quantity).toLocaleString()}</p>
              <p style="margin:0;font-size:11px;color:${COLORS.muted};">₦${item.price.toLocaleString()} each</p>
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
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td style="font-size:12px;color:${COLORS.muted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
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
 * Smart sync: re-queries DB to capture real payment state after 60 seconds.
 */
export async function sendOrderNotificationWithSync(orderId: string, delayMs: number = 60000) {
  console.log(`Email Sync: Waiting ${delayMs}ms before checking order #${orderId}...`);

  setTimeout(async () => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, orderItems: true },
      });

      if (!order) {
        console.log(`Email Sync: Order #${orderId} not found. Skipping.`);
        return;
      }

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
export async function sendOrderNotification(orderId: string, type: 'PENDING' | 'PAID', preloadedOrder?: Order) {
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

    const deliverySection = order.shippingAddress ? `
      <tr>
        <td style="padding:24px 40px 0;">
          <div style="background:${COLORS.bg};border-radius:16px;padding:20px;border:1px solid ${COLORS.border};">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Delivery Info</p>
            <p style="margin:0;font-size:13px;color:${COLORS.text};font-weight:600;">${order.shippingAddress}</p>
            ${order.shippingState ? `<p style="margin:4px 0 0;font-size:12px;color:${COLORS.muted};">${order.shippingState}</p>` : ''}
            <p style="margin:8px 0 0;font-size:12px;color:${COLORS.amber};font-weight:700;">📞 Our team will contact you to discuss delivery pricing before shipping.</p>
          </div>
        </td>
      </tr>
    ` : '';

    const ctaUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`;

    const bodyContent = `
      <!-- STATUS BANNER -->
      <tr>
        <td style="padding:32px 40px 0;text-align:center;">
          ${statusBadge(statusLabel, statusColor, statusBg)}
          <h2 style="margin:16px 0 8px;font-size:24px;font-weight:800;color:${COLORS.text};">
            ${isPaid ? 'Payment Received!' : 'Order on Hold'}
          </h2>
          <p style="margin:0;font-size:14px;color:${COLORS.muted};line-height:1.6;">
            Hi <strong>${order.user.name}</strong>, ${isPaid
              ? 'your payment was successful and your order has been confirmed. We\'ll update you when it\'s ready.'
              : 'we received your order. Please complete your payment to proceed with fulfilment.'}
          </p>
        </td>
      </tr>

      <!-- ORDER ID BOX -->
      <tr>
        <td style="padding:24px 40px 0;">
          <div style="background:${COLORS.darkGreen};border-radius:16px;padding:20px 24px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.5);">Order Reference</p>
            <p style="margin:0;font-size:20px;font-weight:900;color:${COLORS.white};letter-spacing:2px;font-family:monospace;">#${shortId}</p>
          </div>
        </td>
      </tr>

      ${deliverySection}

      <!-- ITEMS -->
      <tr>
        <td style="padding:28px 40px 0;">
          <p style="margin:0 0 16px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Items Ordered</p>
          <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
            ${itemsHtml}
          </table>
        </td>
      </tr>

      <!-- TOTAL -->
      <tr>
        <td style="padding:20px 40px 32px;">
          <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
            <tr>
              <td style="font-size:15px;font-weight:700;color:${COLORS.text};">Total Amount</td>
              <td style="font-size:24px;font-weight:900;color:${COLORS.pureGreen};text-align:right;">₦${order.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
        </td>
      </tr>

      ${divider}

      <!-- CTA BUTTON -->
      <tr>
        <td style="padding:32px 40px;text-align:center;">
          <a href="${ctaUrl}" style="display:inline-block;background:${COLORS.pureGreen};color:${COLORS.white};text-decoration:none;font-size:14px;font-weight:800;padding:16px 36px;border-radius:100px;letter-spacing:0.5px;">
            View Order Details →
          </a>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.user.email],
      subject,
      html: buildEmailWrapper(bodyContent, isPaid ? `Your payment for order #${shortId} was successful.` : `We received your order #${shortId}. Complete your payment to proceed.`),
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
      OUT_FOR_DELIVERY: { color: COLORS.amber, bg: '#fffbeb', icon: '📦', title: 'Out for Delivery!', message: "Your order is almost there — it's out for delivery." },
      DELIVERED:  { color: COLORS.pureGreen, bg: COLORS.lightGreen, icon: '✅', title: 'Order Delivered!', message: "Your order has been successfully delivered. Thank you for choosing Emisco!" },
    };

    const cfg = statusConfig[status] || { color: COLORS.darkGreen, bg: COLORS.bg, icon: '📋', title: `Status: ${status.replace(/_/g, ' ')}`, message: 'Your order status has been updated.' };

    const isLagos = order.shippingState?.toLowerCase() === 'lagos';
    const showLogisticsBox = (status === 'DELIVERED' || status === 'SHIPPED') && !isLagos && order.terminalAddress;
    const showLagosBox = (status === 'DELIVERED' || status === 'SHIPPED') && isLagos;

    const logisticsBox = showLogisticsBox ? `
      <tr>
        <td style="padding:0 40px 28px;">
          <div style="background:#f0fff4;border:2px dashed ${COLORS.pureGreen};border-radius:20px;padding:24px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#2f855a;">📍 Pickup Terminal</p>
            <p style="margin:0 0 8px;font-size:15px;font-weight:800;color:${COLORS.text};">${order.terminalAddress}</p>
            <p style="margin:0;font-size:12px;color:${COLORS.muted};">Please bring a valid ID and your Order ID for collection.</p>
          </div>
        </td>
      </tr>
    ` : '';

    const lagosBox = showLagosBox ? `
      <tr>
        <td style="padding:0 40px 28px;">
          <div style="background:#f0fff4;border:2px dashed ${COLORS.pureGreen};border-radius:20px;padding:24px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#2f855a;">🏢 Lagos Office Pickup</p>
            <p style="margin:0 0 8px;font-size:14px;font-weight:800;color:${COLORS.text};">${EMISCO_OFFICE_ADDRESS}</p>
            <p style="margin:0;font-size:12px;color:${COLORS.muted};">Available Mon – Sat, 8am – 5pm</p>
          </div>
        </td>
      </tr>
    ` : '';

    const bodyContent = `
      <!-- ICON + STATUS -->
      <tr>
        <td style="padding:36px 40px 24px;text-align:center;">
          <div style="font-size:56px;margin-bottom:16px;line-height:1;">${cfg.icon}</div>
          ${statusBadge(status.replace(/_/g, ' '), cfg.color, cfg.bg)}
          <h2 style="margin:16px 0 8px;font-size:24px;font-weight:800;color:${COLORS.text};">${cfg.title}</h2>
          <p style="margin:0;font-size:14px;color:${COLORS.muted};line-height:1.6;">
            Hi <strong>${order.user.name}</strong>, ${cfg.message}
          </p>
        </td>
      </tr>

      <!-- ORDER REFERENCE -->
      <tr>
        <td style="padding:0 40px 28px;">
          <div style="background:${COLORS.bg};border-radius:14px;padding:16px 20px;border:1px solid ${COLORS.border};text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Order Reference</p>
            <p style="margin:0;font-size:18px;font-weight:900;color:${COLORS.text};font-family:monospace;">#${shortId}</p>
          </div>
        </td>
      </tr>

      ${logisticsBox}
      ${lagosBox}

      ${divider}

      <!-- CTA -->
      <tr>
        <td style="padding:32px 40px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}" style="display:inline-block;background:${COLORS.darkGreen};color:${COLORS.white};text-decoration:none;font-size:14px;font-weight:800;padding:16px 36px;border-radius:100px;">
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

    console.log(`✅ Resend: Status update (${status}) sent to ${order.user.email}`);
  } catch (error) {
    console.error('❌ Resend Email Error (sendDeliveryStatusUpdateEmail):', error);
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
        <td style="padding:32px 40px 24px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">💬</div>
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${COLORS.text};">New Customer Message</h2>
          <p style="margin:0;font-size:14px;color:${COLORS.muted};">Someone reached out via the Emisco website contact form.</p>
        </td>
      </tr>

      <!-- CUSTOMER DETAILS CARD -->
      <tr>
        <td style="padding:0 40px 24px;">
          <div style="background:${COLORS.bg};border-radius:16px;padding:24px;border:1px solid ${COLORS.border};">
            <p style="margin:0 0 16px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Customer Details</p>
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
        <td style="padding:0 40px 32px;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};">Message</p>
          <div style="background:#fffbf0;border-left:4px solid ${COLORS.amber};border-radius:0 12px 12px 0;padding:20px 24px;">
            <p style="margin:0;font-size:14px;color:${COLORS.text};line-height:1.7;font-style:italic;">"${data.message}"</p>
          </div>
        </td>
      </tr>

      ${divider}

      <!-- REPLY CTA -->
      <tr>
        <td style="padding:28px 40px;text-align:center;">
          <a href="mailto:${data.email}" style="display:inline-block;background:${COLORS.pureGreen};color:${COLORS.white};text-decoration:none;font-size:14px;font-weight:800;padding:14px 32px;border-radius:100px;">
            Reply to ${data.name} →
          </a>
          <p style="margin:12px 0 0;font-size:11px;color:${COLORS.muted};">Reply directly to ${data.email}</p>
        </td>
      </tr>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: data.email,
      subject: `💬 New Customer Message from ${data.name}`,
      html: buildEmailWrapper(bodyContent, `${data.name} sent a message: "${data.message.slice(0, 80)}..."`),
    });

    console.log(`✅ Resend: Contact feedback email sent from ${data.email}`);
  } catch (error) {
    console.error('❌ Resend Email Error (sendContactFeedbackEmail):', error);
    throw error;
  }
}
