/**
 * Notifications Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE
 */

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'evidence' | 'match' | 'system' | 'message';
}

export const NotificationsService = {
  async getAll(): Promise<NotificationItem[]> {
    return [
      {
        id: 'notif_1',
        title: 'تم تدقيق دليل برمجيات جديد',
        message: 'تم احتساب الدليل بنجاح ورفع موثوقية قدرتك بنسبة 4%.',
        time: 'منذ ساعتين',
        read: false,
        type: 'evidence',
      },
    ];
  },
};
