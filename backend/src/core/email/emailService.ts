import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.authUser,
        pass: config.email.authPass,
      },
    });
  }

  private getFromAddress(): string {
    return `"Audit Pro" <${config.email.fromAddress}>`;
  }

  private getFrontendUrl(): string {
    return config.frontend.url;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${this.getFrontendUrl()}/verify-email/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F5EF; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-family: monospace; font-size: 13px; letter-spacing: 0.2em; color: #0B1220; font-weight: 600;">AUDIT PRO</div>
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1B2130; margin: 0 0 12px;">Verify your email</h1>
          <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin: 0 0 24px;">
            Thanks for creating an account. Click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: #0B1220; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Verify email address
            </a>
          </div>
          <p style="font-size: 13px; color: #9CA3AF; line-height: 1.5; margin: 0 0 8px;">
            Or copy this link into your browser:
          </p>
          <p style="font-size: 12px; color: #B0B4BE; word-break: break-all; margin: 0;">
            ${verifyUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #F3F0E8; margin: 32px 0;" />
          <p style="font-size: 12px; color: #B0B4BE; text-align: center; margin: 0;">
            This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendMail({
      to: email,
      subject: 'Verify your email — Audit Pro',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.getFrontendUrl()}/reset-password/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F5EF; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-family: monospace; font-size: 13px; letter-spacing: 0.2em; color: #0B1220; font-weight: 600;">AUDIT PRO</div>
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1B2130; margin: 0 0 12px;">Reset your password</h1>
          <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset the password for your Audit Pro account. Click the button below to choose a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #0B1220; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Reset password
            </a>
          </div>
          <p style="font-size: 13px; color: #9CA3AF; line-height: 1.5; margin: 0 0 8px;">
            Or copy this link into your browser:
          </p>
          <p style="font-size: 12px; color: #B0B4BE; word-break: break-all; margin: 0;">
            ${resetUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #F3F0E8; margin: 32px 0;" />
          <p style="font-size: 12px; color: #B0B4BE; text-align: center; margin: 0;">
            This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendMail({
      to: email,
      subject: 'Reset your password — Audit Pro',
      html,
    });
  }

  private async sendMail(options: { to: string; subject: string; html: string }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.getFromAddress(),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      logger.info(`📧 Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      logger.error(`❌ Failed to send email to ${options.to}:`, error);
      // In development, log the email content for debugging
      if (config.server.nodeEnv === 'development') {
        logger.info('📧 Email would have been:', {
          to: options.to,
          subject: options.subject,
          preview: options.html.substring(0, 200) + '...',
        });
      }
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('✅ Email transporter connected successfully');
      return true;
    } catch (error) {
      logger.warn('⚠️ Email transporter not available (emails will be logged in dev mode)');
      return false;
    }
  }
}

export const emailService = new EmailService();
