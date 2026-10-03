/**
 * Messages & Communications Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE
 */

export interface MessageThread {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const MessagesService = {
  async getThreads(): Promise<MessageThread[]> {
    return [
      {
        id: 'th_1',
        recipientName: 'لينا الكرمي',
        recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastMessage: 'أهلاً حسين، اطلعت على تفاصيل مسألة معالجة الصوت وسأبدأ بمراجعة الكود.',
        lastMessageTime: 'منذ 10 دقائق',
        unreadCount: 1,
      },
    ];
  },
};
