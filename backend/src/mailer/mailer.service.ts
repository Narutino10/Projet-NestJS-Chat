import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); 

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // => ibrahim60200@gmail.com
      pass: process.env.EMAIL_PASS, // => ton mot de passe d'application
    },
  });

  async sendPasswordReset(to: string, token: string) {
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    console.log('📧 Envoi du mail à', to);
    console.log('🔗 Lien de reset :', resetLink);

    await this.transporter.sendMail({
      from: `"Support NestChat" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔐 Réinitialisation du mot de passe',
      html: `
        <h3>Réinitialisation du mot de passe</h3>
        <p>Tu as demandé à réinitialiser ton mot de passe.</p>
        <p><a href="${resetLink}">Clique ici pour réinitialiser ton mot de passe</a></p>
        <p>Ce lien est valable 15 minutes.</p>
      `,
    });
  }
}
