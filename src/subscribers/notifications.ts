import {redis} from "../lib/redis.js";

const notificationChannel = "notifications";

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export async function publishNotification(notification: NotificationPayload): Promise<void> {
  await redis.publish(notificationChannel, JSON.stringify(notification));
}

export async function startNotificationsSubscriber(): Promise<void> {
  const subscriber = redis.duplicate();
  await subscriber.connect();
  console.log('notifications subscriber ping:', await subscriber.ping());
  await subscriber.subscribe(notificationChannel, (message) => {
    try {
      const notification = JSON.parse(message) as NotificationPayload;
      console.log("Received notification:", notification);
    } catch (error) {
      console.error("Error processing notification:", error, "Message:", message);
    }
  });
}
