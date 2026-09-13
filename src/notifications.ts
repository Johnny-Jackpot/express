import {startNotificationsSubscriber} from "./subscribers/notifications.js";

startNotificationsSubscriber().catch(error => {
  console.error("Error starting notifications subscriber:", error);
  process.exit(1);
});