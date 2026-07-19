export type NotificationType = "match_summary" | "connection_request" | string;

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  referenceId: string;
  createdAt: string;
}
