const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderConfirmationEmail = async (toEmail, customerName, order) => {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #fde4ed;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #fde4ed; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #fde4ed; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    await resend.emails.send({
      from: 'Crochet Vibes by Nisha <onboarding@resend.dev>',
      to: 'yashpednekar89@gmail',
      subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()} 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f0; padding: 30px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🧶</span>
            <h1 style="color: #be1258; font-size: 24px; margin: 10px 0 0;">Crochet Vibes by Nisha</h1>
          </div>
          <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #953d68; font-size: 20px;">Thank you, ${customerName}! 🌸</h2>
            <p style="color: #682e4c; font-size: 14px; line-height: 1.6;">
              Your order has been placed successfully and is now <strong>Pending Verification</strong>.
            </p>
            <div style="background: #fbeef4; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; color: #682e4c; font-size: 14px;"><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
              <p style="margin: 4px 0; color: #682e4c; font-size: 14px;"><strong>Amount Paid:</strong> ₹${order.grandTotal}</p>
              <p style="margin: 4px 0; color: #682e4c; font-size: 14px;"><strong>Status:</strong> Pending Verification</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr style="background: #fbeef4;">
                  <th style="padding: 10px; text-align: left; color: #953d68; font-size: 13px;">Item</th>
                  <th style="padding: 10px; text-align: center; color: #953d68; font-size: 13px;">Qty</th>
                  <th style="padding: 10px; text-align: right; color: #953d68; font-size: 13px;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="text-align: right; margin-top: 16px; padding-top: 16px; border-top: 2px solid #fbeef4;">
              <p style="color: #682e4c; font-size: 16px; font-weight: bold;">Total: ₹${order.grandTotal}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 16px; color: #c9a0b4; font-size: 12px;">
            <p>Made with 🌸 by Crochet Vibes</p>
          </div>
        </div>
      `,
    });
    console.log('Order confirmation email sent to', toEmail);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

const sendStatusUpdateEmail = async (toEmail, customerName, order, status) => {
  try {
    const statusEmojis = {
      'Confirmed': '✅',
      'Shipped': '🚚',
      'Delivered': '📦',
      'Cancelled': '❌',
    };

    await resend.emails.send({
      from: 'Crochet Vibes by Nisha <onboarding@resend.dev>',
      to: 'yashpednekar89@gmail',
      subject: `Order ${status} ${statusEmojis[status] || ''} #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f0; padding: 30px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">${statusEmojis[status] || '🧶'}</span>
            <h1 style="color: #be1258; font-size: 24px; margin: 10px 0 0;">Crochet Vibes by Nisha</h1>
          </div>
          <div style="background: white; border-radius: 16px; padding: 24px;">
            <h2 style="color: #953d68; font-size: 20px;">Hi ${customerName}! 🌸</h2>
            <p style="color: #682e4c; font-size: 14px; line-height: 1.6;">
              Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> is now: <strong>${status}</strong>
            </p>
            <div style="background: #fbeef4; border-radius: 12px; padding: 16px; margin-top: 16px; text-align: center;">
              <p style="margin: 0; color: #953d68; font-size: 18px; font-weight: bold;">${status} ${statusEmojis[status] || ''}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 16px; color: #c9a0b4; font-size: 12px;">
            <p>Made with 🌸 by Crochet Vibes</p>
          </div>
        </div>
      `,
    });
    console.log('Status update email sent to', toEmail);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

module.exports = { sendOrderConfirmationEmail, sendStatusUpdateEmail };