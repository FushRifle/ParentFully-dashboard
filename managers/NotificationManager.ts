import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";
import {
     pushNotificationService,
     notificationService
} from "@/services/push-notifications/pushNotificationService";

type PlatformType = "ios" | "android";

class NotificationManager {
     private expoToken: string | null = null;
     private unreadCount = 0;
     private listeners: Set<(count: number) => void> = new Set();
     private processedIds: Set<string> = new Set();
     private pollingInterval: ReturnType<typeof setInterval> | null = null;
     private currentUserId: number | null = null;

     /** Initialize manager for a specific user */
     async init(userId: number) {
          if (!Device.isDevice) {
               console.log("Push notifications not supported on emulator");
               return;
          }

          // If switching users, reset state
          if (this.currentUserId !== userId) {
               this.stop();
               this.currentUserId = userId;
               this.processedIds.clear();
               this.unreadCount = 0;
               this.notify();
          }

          Notifications.setNotificationHandler({
               handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true,
               }),
          });

          if (Platform.OS === "android") await this.setupAndroidChannels();
          await this.registerToken();
          await this.pollNotifications();
          this.startPolling();
     }

     /** Android channels */
     private async setupAndroidChannels() {
          await Notifications.setNotificationChannelAsync("default", {
               name: "default",
               importance: Notifications.AndroidImportance.MAX,
               sound: "default",
               enableVibrate: true,
               vibrationPattern: [0, 250, 250, 250],
          });
          await Notifications.setNotificationChannelAsync("alarm", {
               name: "alarm",
               importance: Notifications.AndroidImportance.MAX,
               sound: "default",
               enableVibrate: true,
               vibrationPattern: [0, 500, 500, 500],
          });
     }

     /** Request & register Expo push token */
     private async registerToken() {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== "granted") {
               const { status } = await Notifications.requestPermissionsAsync();
               finalStatus = status;
          }

          if (finalStatus !== "granted") {
               console.log("Push permission not granted");
               return;
          }

          const token = (
               await Notifications.getExpoPushTokenAsync({
                    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
               })
          ).data;
          this.expoToken = token;

          const deviceId =
               Platform.OS === "android"
                    ? Application.getAndroidId()
                    : await Application.getIosIdForVendorAsync();

          await pushNotificationService.registerDeviceToken({
               token,
               platform: Platform.OS as PlatformType,
               device_id: deviceId ?? undefined,
          });

          console.log("Push token registered:", token);
     }

     /** Subscribe to unread count updates */
     subscribe(listener: (count: number) => void) {
          this.listeners.add(listener);
          return () => this.listeners.delete(listener);
     }

     /** Notify all subscribers */
     private notify() {
          this.listeners.forEach((listener) => listener(this.unreadCount));
     }

     /** Start polling backend every 5s */
     private startPolling() {
          if (this.pollingInterval) clearInterval(this.pollingInterval);
          this.pollingInterval = setInterval(() => this.pollNotifications(), 5000);
     }

     /** Fully async-safe polling */
     private async pollNotifications() {
          if (!this.currentUserId) return;

          try {
               const res = await notificationService.getUnreadNotifications();

               // Process new notifications safely in sequence
               for (const notification of res.data.filter(
                    (n) => n.user_id === this.currentUserId
               )) {
                    const id = notification.id.toString();
                    if (!this.processedIds.has(id)) {
                         this.processedIds.add(id);

                         console.log(
                              `Scheduling local notification for ID ${id}:`,
                              notification.title
                         );

                         // await ensures proper sequencing
                         await this.scheduleLocal(
                              notification.title,
                              notification.message ?? "",
                              true
                         );

                         this.unreadCount++; // increment safely
                         this.notify();
                    }
               }
          } catch (error) {
               console.error("Failed to fetch notifications:", error);
          }
     }

     /** Schedule local notification */
     async scheduleLocal(title: string, body: string, isAlarm = true, id?: string) {
          if (id && this.processedIds.has(id)) return;
          if (id) this.processedIds.add(id);

          await Notifications.scheduleNotificationAsync({
               content: { title, body, sound: isAlarm ? "alarm" : "default" },
               trigger: { seconds: 1, channelId: isAlarm ? "alarm" : "default" },
          });
     }

     /** Refresh unread count from backend */
     async refreshUnread() {
          if (!this.currentUserId) return 0;

          try {
               const res = await notificationService.getUnreadNotifications();
               this.unreadCount = res.unread_count ?? 0;
               this.notify();
               return this.unreadCount;
          } catch (error) {
               console.error("Error refreshing unread count:", error);
               throw error;
          }
     }

     /** Return current unread count */
     getUnread() {
          return this.unreadCount;
     }

     /** Stop polling and reset state */
     stop() {
          if (this.pollingInterval) clearInterval(this.pollingInterval);
          this.pollingInterval = null;
          this.currentUserId = null;
          this.processedIds.clear();
          this.unreadCount = 0;
          this.notify();
     }
}

export const notificationManager = new NotificationManager();
