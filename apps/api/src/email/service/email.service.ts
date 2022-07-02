import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { environment } from '../../environments/environment';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor() {
    this.nodemailerTransport = createTransport({
      service: environment.email.service,
      auth: environment.email.auth
    });
  }

  public sendMail(options: Mail.Options): Promise<unknown> {
    return this.nodemailerTransport.sendMail(options);
  }
}
