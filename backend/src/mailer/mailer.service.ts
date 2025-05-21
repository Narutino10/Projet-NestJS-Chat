import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ibrahim60200@gmail.com',
      pass: 'anig wilf jknh aoxw',
    },
  });

  async sendPasswordReset(to: string, token: string) {
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    console.log('📧 Envoi du mail à', to);
    console.log('🔗 Lien de reset :', resetLink);

    await this.transporter.sendMail({
      from: `"Support NestChat" <ibrahim60200@gmail.com>`,
      to,
      subject: '🔐 Réinitialisation du mot de passe',
      html: `<p>Clique ici : <a href="${resetLink}">${resetLink}</a></p>`,
    });
  }
}
