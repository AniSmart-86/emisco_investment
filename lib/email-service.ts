import nodemailer from 'nodemailer';
import prisma from './prisma';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Standardizes Gmail settings
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password
  },
});

const EMISCO_LOGO = "https://res.cloudinary.com/dupdplmls/image/upload/v1774946745/l5kle05zlyyu08qo5cyy.jpg"; // Using a part image as placeholder logo if not available
const PRIMARY_COLOR = "#0D3121"; // Dark Green
const SECONDARY_COLOR = "#10b981"; // Pure Green

export async function sendOrderNotification(orderId: string, type: 'CREATED' | 'PAID') {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: true,
      },
    });

    if (!order || !order.user.email) return;

    const subject = type === 'PAID' 
      ? `Order Confirmed - #${order.id.slice(0, 8).toUpperCase()}`
      : `Order Received - #${order.id.slice(0, 8).toUpperCase()}`;

    const statusText = type === 'PAID' 
      ? 'Your payment was successful and your order is confirmed!'
      : 'We have received your order. Please complete your payment to proceed.';

    const itemsHtml = order.orderItems
      .map(
        (item) => `
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
      to: order.user.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; margin: 0 !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f7fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table class="container" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background: ${PRIMARY_COLOR}; padding: 40px 20px; text-align: center;">
                <div style="display: inline-block; background: white; padding: 10px; border-radius: 12px; margin-bottom: 15px;">
                  <img src="${EMISCO_LOGO}" alt="Emisco" style="width: 40px; height: 40px; display: block;">
                </div>
                <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: -0.5px;">EMISCO INVESTMENT LTD</h1>
                <p style="color: rgba(255,255,255,0.7); margin-top: 5px; font-size: 14px; text-transform: uppercase; tracking: 0.1em;">Truck Parts Specialist</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1a202c; margin-top: 0; font-size: 20px;">${type === 'PAID' ? 'Confirmation' : 'Order Received'}</h2>
                <p style="color: #4a5568; line-height: 1.6;">Hi ${order.user.name}, ${statusText}</p>
                
                <div style="background: #f7fafc; border: 1px solid #edf2f7; border-radius: 16px; padding: 20px; margin: 30px 0;">
                  <table style="width: 100%;">
                    <tr>
                      <td><span style="color: #718096; font-size: 12px; font-weight: 700; text-transform: uppercase;">Order ID</span></td>
                      <td style="text-align: right;"><span style="color: #718096; font-size: 12px; font-weight: 700; text-transform: uppercase;">Date</span></td>
                    </tr>
                    <tr>
                      <td><span style="color: #1a202c; font-weight: 600;">#${order.id.toUpperCase().slice(0, 12)}</span></td>
                      <td style="text-align: right;"><span style="color: #1a202c; font-weight: 600;">${new Date(order.createdAt).toLocaleDateString()}</span></td>
                    </tr>
                  </table>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th style="padding-bottom: 10px; border-bottom: 2px solid #edf2f7; text-align: left; font-size: 12px; color: #718096; text-transform: uppercase;">Product</th>
                      <th style="padding-bottom: 10px; border-bottom: 2px solid #edf2f7; text-align: right; font-size: 12px; color: #718096; text-transform: uppercase;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <div style="margin-top: 20px;">
                  <table style="width: 100%;">
                    <tr>
                      <td style="padding: 10px 0; color: #718096;">Subtotal</td>
                      <td style="padding: 10px 0; text-align: right; color: #1a202c; font-weight: 600;">₦${order.totalAmount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0; color: #1a202c; font-size: 18px; font-weight: 800;">Total</td>
                      <td style="padding: 15px 0; text-align: right; color: ${SECONDARY_COLOR}; font-size: 20px; font-weight: 800;">₦${order.totalAmount.toLocaleString()}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?orderId=${order.id}" style="background: ${SECONDARY_COLOR}; color: white; padding: 18px 30px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px rgba(16, 185, 129, 0.2);">View Order Details</a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px; background: #f7fafc; text-align: center; border-top: 1px solid #edf2f7;">
                <p style="color: #718096; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Emisco Investment Ltd. All rights reserved.</p>
                <p style="color: #a0aec0; font-size: 11px; margin-top: 5px;">You received this email because you placed an order on our store.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification (${type}) sent to ${order.user.email}`);
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

    if (!order || !order.user.email) return;

    const statusColors: Record<string, string> = {
      'PROCESSING': '#3b82f6',
      'SHIPPED': '#8b5cf6',
      'OUT_FOR_DELIVERY': '#f59e0b',
      'DELIVERED': '#10b981',
    };

    const color = statusColors[status] || SECONDARY_COLOR;

    const mailOptions = {
       from: `"Emisco Investment Ltd" <${process.env.SMTP_USER}>`,
      to: order.user.email,
      subject: `Delivery Update - OrderId:${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 20px; background-color: #f7fafc; font-family: sans-serif;">
          <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 20px; overflow: hidden; border: 1px solid #edf2f7;">
            <tr>
              <td style="background: ${PRIMARY_COLOR}; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Order Status Update</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <div style="font-size: 14px; text-transform: uppercase; color: #718096; font-weight: 700; margin-bottom: 10px;">Delivery Status</div>
                <div style="font-size: 32px; font-weight: 800; color: ${color};">${status.replace(/_/g, ' ')}</div>
                
                <p style="color: #4a5568; margin-top: 30px; line-height: 1.6;">Hi ${order.user.name}, your order with this id <b>#${order.id.slice(0, 8).toUpperCase()}</b> has progressed to it's next stage!</p>
                
                <div style="margin-top: 40px;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?orderId=${order.id}" style="background: ${PRIMARY_COLOR}; color: white; padding: 15px 25px; border-radius: 12px; text-decoration: none; font-weight: 700;">Track Your Package</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background: #f7fafc; text-align: center; color: #a0aec0; font-size: 12px;">
                Emisco Investment Ltd - Fast & Reliable Delivery
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email (${status}) sent to ${order.user.email}`);
  } catch (error) {
    console.error('Email Status Update Error:', error);
  }
}
