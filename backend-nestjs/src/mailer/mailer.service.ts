import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shruthimr2003@gmail.com',
      pass: 'ntdi ryme wmdk fmco',
    },
  });

  async sendToken(
    email: string,
    token: string,
    applicant_id: string,
    attempt_id: string,
  ) {
    const link = `http://localhost:5173/test/${token}/${applicant_id}/${attempt_id}`;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Your MCQ Test Link',
        html: `<p>Click the following link to take the test:</p><a href="${link}">${link}</a>`,
      });
    } catch (err) {
      console.error('❌ Failed to send email:', err);
      throw new Error('Failed to send test link email');
    }
  }
}
