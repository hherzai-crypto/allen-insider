import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendWelcomeEmail(
  email: string,
  verificationUrl: string
) {
  const msg = {
    to: email,
    from: 'hamid@allen-insider.com',
    subject: 'Confirm your Allen Insider subscription',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #006B6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: Montserrat, sans-serif;">
            ALLEN INSIDER
          </h1>
          <p style="color: #D4AF37; margin: 8px 0 0 0;">
            Your Weekly Guide to Allen, TX
          </p>
        </div>

        <div style="padding: 32px; background: white;">
          <h2 style="color: #006B6B; font-family: Montserrat, sans-serif;">
            Almost there! Confirm your subscription
          </h2>

          <p style="color: #2D2D2D; line-height: 1.6;">
            Thanks for signing up for Allen Insider! To start receiving the best local
            events every Thursday at 4 PM, please confirm your email address.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}"
               style="background: #D4AF37; color: #2D2D2D; padding: 14px 32px;
                      text-decoration: none; border-radius: 8px; font-weight: 600;
                      display: inline-block; font-family: Montserrat, sans-serif;">
              Confirm My Subscription
            </a>
          </div>

          <p style="color: #6B6B6B; font-size: 14px; line-height: 1.6;">
            This link expires in 24 hours. If you didn't sign up for Allen Insider,
            you can safely ignore this email.
          </p>

          <p style="color: #2D2D2D; line-height: 1.6; margin-top: 24px;">
            See you soon!<br>
            <strong>Hamid</strong><br>
            <span style="color: #6B6B6B; font-size: 14px;">Your Allen Insider</span>
          </p>
        </div>

        <div style="background: #2D2D2D; padding: 20px; text-align: center;">
          <p style="color: #6B6B6B; margin: 0; font-size: 12px;">
            © 2026 Allen Insider • Made in Allen, TX
          </p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendNewsletter(
  subscribers: Array<{ email: string; unsubscribe_token: string }>,
  subject: string,
  htmlContent: string
) {
  const messages = subscribers.map((sub) => {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/unsubscribe?token=${sub.unsubscribe_token}`;

    return {
      to: sub.email,
      from: 'hamid@allen-insider.com',
      subject,
      html: `
        ${htmlContent}
        <div style="background: #2D2D2D; padding: 20px; text-align: center; margin-top: 32px;">
          <p style="color: #6B6B6B; margin: 0; font-size: 12px;">
            © 2026 Allen Insider • Made in Allen, TX
          </p>
          <p style="color: #6B6B6B; margin: 8px 0 0 0; font-size: 12px;">
            <a href="${unsubscribeUrl}" style="color: #D4AF37; text-decoration: none;">
              Unsubscribe
            </a>
          </p>
        </div>
      `,
    };
  });

  await sgMail.send(messages);
}
