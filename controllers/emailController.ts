import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailController {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    this.sendEmail = this.sendEmail.bind(this);
  }

  public async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, subject, text, html } = req.body;
      
      console.log('Received email request:', { to, subject, hasText: !!text, hasHtml: !!html });

      if (!to) {
        res.status(400).json({
          success: false,
          message: 'Missing required field: to',
        });
        return;
      }

      if (!subject) {
        res.status(400).json({
          success: false,
          message: 'Missing required field: subject',
        });
        return;
      }

      if (!text && !html) {
        res.status(400).json({
          success: false,
          message: 'Either text or html content is required',
        });
        return;
      }

      const mailOptions: EmailOptions = {
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        ...mailOptions,
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const emailController = new EmailController();
