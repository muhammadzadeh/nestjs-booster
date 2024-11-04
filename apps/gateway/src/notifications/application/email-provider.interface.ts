import { NotificationDispatcherResponse } from "./notifications.dispatcher";

export const MAILER_TOKEN = Symbol('Mailer');
export interface Mailer {
  sendMail(data: SendEmailData): Promise<NotificationDispatcherResponse>;
  getName(): string;
}

export interface SendEmailData {
  to: string;
  template: string;
  title: string | undefined;
  body: { [key: string]: any };
}
