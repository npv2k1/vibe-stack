import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SendMailDto } from './dtos/send-mail.dto';

@Injectable()
export class MailServiceService implements OnModuleInit {
  constructor(
    @Inject('MAIL_SERVICE')
    private readonly mailService: ClientProxy
  ) {}
  async onModuleInit() {
    try {
      await this.mailService.connect();
      console.log('MailService connected');
    } catch (error) {
      console.error(error);
    }
  }

  async send(data: SendMailDto) {
    return await new Promise((resolve, reject) => {
      try {
        this.mailService.send('send', data).subscribe({
          next: (result) => {
            console.log(result);
            resolve(result);
          },
          error: (err) => {
            console.log(err);
            reject(err);
          },
        });
      } catch (error) {
        console.log(error);
      }
      resolve('done');
    });
  }

  async ping() {
    return await new Promise((resolve, reject) => {
      try {
        this.mailService.send('ping', 'ping').subscribe({
          next: (result) => {
            resolve(result);
          },
          error: (err) => {
            console.log(err);
          },
        });
      } catch (error) {
        console.log(error);
      }
      resolve('done');
    });
  }

  async generateResetPasswordEmail(token: string) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #333;">Reset Your Password</h1>
        <p style="color: #555;">You requested to reset your password. Use the token below to reset it:</p>
        <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
          <p style="font-size: 18px; color: #333; margin: 0;">${token}</p>
        </div>
        <p style="color: #555;">Copy the token above and use it to reset your password.</p>
        <p style="color: #555;">If you did not request a password reset, please ignore this email.</p>
        <p style="color: #555;">Thank you,<br>Your App Team</p>
      </div>
    `;
  }

  async generateWelcomeEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #333;">Welcome to Your App</h1>
        <p style="color: #555;">You have successfully signed up for Your App. Welcome to our platform!</p>
        <p style="color: #555;">Thank you for choosing Your App.</p>
        <p style="color: #555;">Thank you,<br>Your App Team</p>
      </div>
    `;
  }

  async generatePasswordChangeSuccessEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #333;">Password Changed Successfully</h1>
        <p style="color: #555;">Your password has been changed successfully. If you did not make this change, please contact our support team immediately.</p>
        <p style="color: #555;">Thank you,<br>Your App Team</p>
      </div>
    `;
  }
}
