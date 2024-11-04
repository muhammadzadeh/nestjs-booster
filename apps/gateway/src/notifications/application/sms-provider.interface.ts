import { Mobile } from "@repo/types/common.types";
import { NotificationDispatcherResponse } from "./notifications.dispatcher";

export const SMS_SENDER_TOKEN = Symbol('SmsSender');
export interface SmsSender {
  send(data: SendSmsData): Promise<NotificationDispatcherResponse>;
  getName(): string;
}

export interface SendSmsData {
  to: Mobile;
  message: string;
  template: string;
}
