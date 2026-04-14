import nodemailer from 'nodemailer';
import prisma from './prisma';
import { Order, OrderItem } from './types';
import { EMISCO_OFFICE_ADDRESS } from './logistics-data';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Standardizes Gmail settings
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password
  },
});

const EMISCO_LOGO = "https://res.cloudinary.com/dupdplmls/image/upload/v1774946745/l5kle05zlyyu08qo5cyy.jpg";
const PRIMARY_COLOR = "#0D3121"; // Dark Green
const SECONDARY_COLOR = "#10b981"; // Pure Green

/**
 * Sends a delayed order notification if the payment is still pending.
 * This ensures the database and email status are perfectly in sync.
 */
export async function sendOrderNotificationWithSync(orderId: string, delayMs: number = 60000) {
  console.log(`Email Sync: Waiting ${delayMs}ms before checking order #${orderId}...`);
  
  setTimeout(async () => {
    try {
      // 1. Re-query the database to get the latest status
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          orderItems: true,
        },
      });

      if (!order) {
        console.log(`Email Sync: Order #${orderId} not found. Skipping.`);
        return;
      }

      // 2. Dynamic Decision: "Capture" the state after 60 seconds
      // Determine which version of the email to send based on current status
      const type = order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING';
      
      await sendOrderNotification(orderId, type, order);
      
      
    } catch (error) {
      console.error('Email Sync Error:', error);
    }
  }, delayMs);
}

/**
 * Core notification function for both immediate (PAID) and delayed (CREATED) emails.
 */
export async function sendOrderNotification(orderId: string, type: 'PENDING' | 'PAID', preloadedOrder?: Order) {
  try {
    const order = preloadedOrder || await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: true,
      },
    });
    if (!order || !order.user || !order.user.email || !order.orderItems) return;

    const subject = type === 'PAID' 
      ? `Order Confirmed - ${order.id.toUpperCase()}`
      : `Order Received - ${order.id.toUpperCase()}`;

    const statusText = type === 'PAID' 
      ? 'Your payment was successful and your order is confirmed!'
      : 'We have received your order. Please complete your payment to proceed.';

    const itemsHtml = order.orderItems
      .map(
        (item: OrderItem) => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #edf2f7;">
           <table cellpadding="0" cellspacing="0">
             <tr>
               <td style="width: 50px; height: 50px; border-radius: 8px; background: #f7fafc; overflow: hidden;">
                 ${item.productImage ? `<img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
               </td>
               <td style="padding-left: 15px;">
                 <div style="font-weight: 600; color: #1a202c;">${item.productName || 'Product'}</div>
                 <div style="font-size: 12px; color: #718096;">Qty: ${item.quantity}</div>
               </td>
             </tr>
           </table>
        </td>
        <td style="padding: 15px 0; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 600; color: #1a202c;">
          ₦${item.price.toLocaleString()}
        </td>
      </tr>
    `
      )
      .join('');

    const mailOptions = {
      from: `"Emisco Investment Ltd" <${process.env.SMTP_USER}>`,
      to: order.user?.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 10px; background-color: #f7fafc; font-family: sans-serif;">
          <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.05);">
            <tr>
              <td style="background: ${PRIMARY_COLOR}; padding: 30px 10px; text-align: center;">
                <div style="display: inline-block; background: white; padding: 10px; border-radius: 12px; margin-bottom: 15px;">
                  <img src="${EMISCO_LOGO}" alt="Emisco" style="width: 40px; height: 40px; display: block;">
                </div>
                <h1 style="color: white; margin: 0; font-size: 20px;">EMISCO INVESTMENT LTD</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1a202c; text-align: center;">${type === 'PAID' ? 'Confirmation' : 'Order Received'}</h2>
                <p style="color: #4a5568; line-height: 1.6;">Hi ${order.user?.name}, ${statusText}</p>
                <div style="background: #f7fafc; padding: 20px; margin: 20px 0; border-radius: 12px;">
                   <b>Order ID:</b> #${order.id.toUpperCase()}
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th style="padding-bottom: 10px; border-bottom: 2px solid #edf2f7; text-align: left;">Product</th>
                      <th style="padding-bottom: 10px; border-bottom: 2px solid #edf2f7; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
                <div style="margin-top: 20px; text-align: right;">
                   <h3 style="color: ${SECONDARY_COLOR};">Total: ₦${order.totalAmount.toLocaleString()}</h3>
                </div>
                <div style="margin-top: 40px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}" style="background: ${SECONDARY_COLOR}; color: white; padding: 15px 25px; border-radius: 12px; text-decoration: none; font-weight: 700;">View Order Details</a>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification (${type}) sent to ${order.user?.email}`);
  } catch (error) {
    console.error('Email Notification Error:', error);
  }
}

export async function sendDeliveryStatusUpdateEmail(orderId: string, status: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order || !order.user || !order.user.email) return;

    const statusColors: Record<string, string> = {
      'PROCESSING': '#3b82f6',
      'SHIPPED': '#8b5cf6',
      'OUT_FOR_DELIVERY': '#f59e0b',
      'DELIVERED': '#10b981',
    };

    const color = statusColors[status] || PRIMARY_COLOR;
    const isLagos = order.shippingState?.toLowerCase() === 'lagos';
    const showLogisticsInstructions = (status === 'DELIVERED' || status === 'SHIPPED') && !isLagos && order.terminalAddress;
    const showLagosInstructions = (status === 'DELIVERED' || status === 'SHIPPED') && isLagos;

    const mailOptions = {
       from: `"Emisco Investment Ltd" <${process.env.SMTP_USER}>`,
      to: order.user?.email,
      subject: `Delivery Update - OrderId:${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 20px; background-color: #f7fafc; font-family: sans-serif;">
          <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 20px; overflow: hidden; border: 1px solid #edf2f7;">
            <tr>
              <td style="background: ${PRIMARY_COLOR}; padding: 30px; text-align: center;">
                <div style="display: inline-block; background: white; padding: 8px; border-radius: 10px; margin-bottom: 12px;">
                  <img src="${EMISCO_LOGO}" alt="Emisco" style="width: 30px; height: 30px; display: block;">
                </div>
                <h1 style="color: white; margin: 0; font-size: 20px;">Order Status Update</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <div style="font-size: 14px; text-transform: uppercase; color: #718096; font-weight: 700; margin-bottom: 10px;">Delivery Status</div>
                <div style="font-size: 32px; font-weight: 800; color: ${color};">${status.replace(/_/g, ' ')}</div>
                <p style="color: #4a5568; margin-top: 30px;">Hi ${order.user?.name}, your order <b>#${order.id.slice(0, 8).toUpperCase()}</b> has updated status!</p>
                
                ${showLogisticsInstructions ? `
                <div style="margin-top: 40px; padding: 25px; background: #f0fff4; border: 2px dashed #48bb78; border-radius: 16px;">
                  <h3 style="margin-top: 0; color: #2f855a;">📍 Pickup Instructions</h3>
                  <p style="color: #4a5568; margin-bottom: 5px;">
                    ${status === 'DELIVERED' ? 'Your package has arrived at the terminal!' : 'Your package has been dispatched to the pickup terminal.'}
                  </p>
                  <div style="font-size: 18px; font-weight: 800; color: #1a202c; margin: 10px 0;">${order.terminalAddress}</div>
                  <p style="font-size: 12px; color: #718096; margin-bottom: 0;">Please bring a valid ID and your Order ID for collection.</p>
                </div>
                ` : ''}

                ${showLagosInstructions ? `
                <div style="margin-top: 40px; padding: 25px; background: #f0fff4; border: 2px dashed #48bb78; border-radius: 16px;">
                  <h3 style="margin-top: 0; color: #2f855a;">🏢 Lagos Office Pickup</h3>
                  <p style="color: #4a5568; margin-bottom: 5px;">
                    Your order is ready for collection at our main office branch.
                  </p>
                  <div style="font-size: 16px; font-weight: 800; color: #1a202c; margin: 10px 0;">${EMISCO_OFFICE_ADDRESS}</div>
                  <div style="background: #ffffff; padding: 12px; border-radius: 8px; margin-top: 15px; text-align: left; border: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #4a5568; margin: 0;"><b>Home Delivery:</b> Contact our support team for doorstep arrangements within Lagos.</p>
                  </div>
                  <p style="font-size: 11px; color: #718096; margin-top: 15px; margin-bottom: 0;">Available Mon - Sat (8am - 5pm).</p>
                </div>
                ` : ''}

                <div style="margin-top: 40px;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}" style="background: ${PRIMARY_COLOR}; color: white; padding: 15px 25px; border-radius: 12px; text-decoration: none;">Track Your Package</a>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email (${status}) sent to ${order.user?.email}`);
  } catch (error) {
    console.error('Email Status Update Error:', error);
  }
}
