// /lib/email.ts
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is missing');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailData {
  customerEmail: string;
  productName: string;
  licenseKey: string;
  orderId: string;
}

export async function sendEmail({ customerEmail, productName, licenseKey, orderId }: EmailData) {
  const msg = {
    to: customerEmail,
    from: process.env.SENDGRID_VERIFIED_SENDER || 'ryacy.corp@gmail.com',
    subject: `Your Ryacy Solutions License Key - ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #765de7;">
          <h1 style="color: #333333; margin: 0;">
            Ryacy <span style="color: #765de7;">Solutions</span>
          </h1>
        </div>

        <div style="padding: 30px 0;">
          <h2 style="color: #765de7; text-align: center; margin-bottom: 30px;">
            Thank You for Your Purchase!
          </h2>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eaeaea;">
            <h3 style="color: #333; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
              Your License Information
            </h3>
            <div style="margin: 15px 0;">
              <p style="margin: 10px 0; color: #666;">
                <strong style="color: #333;">Product:</strong> ${productName}
              </p>
              <p style="margin: 10px 0; color: #666;">
                <strong style="color: #333;">Order ID:</strong> ${orderId}
              </p>
              <p style="margin: 10px 0; color: #666;">
                <strong style="color: #333;">License Key:</strong> 
                <code style="background: #eee; padding: 3px 6px; border-radius: 4px; display: block; margin-top: 5px; word-break: break-all;">
                  ${licenseKey}
                </code>
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea;">
              <h4 style="color: #333; margin-bottom: 10px;">Important Notes:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Keep your license key safe and secure</li>
                <li>Do not share your license key with others</li>
                <li>Your license key is permanent and will not expire</li>
                <li>For technical support, contact support@ryacy.com</li>
              </ul>
            </div>
          </div>

          <div style="background-color: #f0f4ff; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <p style="color: #666; margin: 0; font-size: 0.9em;">
              If you didn't make this purchase or need assistance, please contact our support team immediately.
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 20px;">
          <p style="color: #666; margin: 5px 0; font-size: 14px;">
            © ${new Date().getFullYear()} Ryacy Solutions. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ License key email sent successfully');
    return response;
  } catch (error) {
    console.error('❌ SendGrid Error:', error);
    throw error;
  }
}