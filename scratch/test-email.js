// require('dotenv').config();
// const nodemailer = require('nodemailer');

// async function testEmail() {
//   console.log('Testing SMTP with:', {
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     user: process.env.SMTP_USER,
//   });

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   try {
//     const info = await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to: process.env.SMTP_USER, // Send to self
//       subject: 'Emisco SMTP Test',
//       text: 'If you see this, your SMTP configuration is working perfectly!',
//       html: '<b>If you see this, your SMTP configuration is working perfectly!</b>',
//     });

//     console.log('✅ Email sent successfully:', info.messageId);
//   } catch (error) {
//     console.error('❌ SMTP Test Failed:', error);
//   }
// }

// testEmail();
