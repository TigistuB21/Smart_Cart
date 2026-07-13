import { Expo, ExpoPushMessage } from 'expo-server-sdk';

export interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  /**
   * Dispatches push notifications to Expo Push tokens.
   */
  async sendPushNotifications(messages: PushNotificationPayload[]): Promise<void> {
    const expoMessages: ExpoPushMessage[] = [];

    for (const msg of messages) {
      // Validate the token to prevent sending requests to invalid addresses
      if (!Expo.isExpoPushToken(msg.token)) {
        console.warn(`[Warning] Invalid Expo Push Token: ${msg.token}`);
        continue;
      }

      expoMessages.push({
        to: msg.token,
        sound: 'default',
        title: msg.title,
        body: msg.body,
        data: msg.data,
      });
    }

    // Expo recommends chunking messages to prevent request timeouts
    const chunks = this.expo.chunkPushNotifications(expoMessages);
    
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(`Successfully dispatched batch of ${ticketChunk.length} notification tickets.`);
      } catch (error) {
        console.error('Error dispatching push notifications batch:', error);
        throw error;
      }
    }
  }
}
