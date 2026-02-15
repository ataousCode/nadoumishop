export enum NotificationType {
  EMAIL = "email",
  SMS = "sms", // Placeholder for future
}

export interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  context: any;
}

export interface NotificationPayload {
  type: NotificationType;
  payload: EmailPayload; // Union type in future
}
