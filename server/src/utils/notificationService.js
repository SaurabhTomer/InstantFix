import Notification from "../models/notification.model.js";
import { getSocketIO } from "../socket/socket.js";

// Create notification utility
export const createNotification = async (userId, title, message, type) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    // Emit real-time notification via Socket.IO
    const io = getSocketIO();
    if (io) {
      io.to(userId).emit('newNotification', {
        id: notification._id,
        title,
        message,
        type,
        createdAt: notification.createdAt,
      });
      console.log(`Notification sent to user ${userId} via socket`);
    } else {
      console.log("Socket.IO not available, notification saved to database only");
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Notification templates for different events
export const NotificationTemplates = {
  // Service Request Notifications
  REQUEST_ACCEPTED: (electricianName) => ({
    title: "Request Accepted! 🎉",
    message: `${electricianName} has accepted your service request and will be arriving soon.`,
    type: "REQUEST_ACCEPTED"
  }),

  REQUEST_STARTED: (electricianName) => ({
    title: "Work Started! 🔧",
    message: `${electricianName} has started working on your service request.`,
    type: "REQUEST_STARTED"
  }),

  REQUEST_COMPLETED: (electricianName) => ({
    title: "Service Completed! ✅",
    message: `${electricianName} has completed your service request. Please rate the service.`,
    type: "REQUEST_COMPLETED"
  }),

  REQUEST_CANCELLED: (reason) => ({
    title: "Request Cancelled ❌",
    message: reason || "Your service request has been cancelled.",
    type: "REQUEST_CANCELLED"
  }),

  // Electrician Notifications
  ELECTRICIAN_APPROVED: () => ({
    title: "Account Approved! 🎉",
    message: "Your electrician account has been approved. You can now accept service requests.",
    type: "ELECTRICIAN_APPROVED"
  }),

  ELECTRICIAN_REJECTED: (reason) => ({
    title: "Account Rejected ❌",
    message: reason || "Your electrician account application has been rejected.",
    type: "ELECTRICIAN_REJECTED"
  }),

  NEW_SERVICE_REQUEST: (userLocation, serviceType) => ({
    title: "New Service Request! 🔔",
    message: `New ${serviceType || 'service'} request available near ${userLocation || 'your location'}.`,
    type: "NEW_SERVICE_REQUEST"
  }),

  REQUEST_ASSIGNED: (userName) => ({
    title: "Request Assigned! 📋",
    message: `Service request from ${userName} has been assigned to you.`,
    type: "REQUEST_ASSIGNED"
  }),

  // Admin Notifications
  NEW_ELECTRICIAN_APPLICATION: (electricianName) => ({
    title: "New Electrician Application 📝",
    message: `${electricianName} has applied to become an electrician.`,
    type: "NEW_ELECTRICIAN_APPLICATION"
  }),

  SERVICE_REQUEST_CREATED: (userName) => ({
    title: "New Service Request Created 🔧",
    message: `${userName} has created a new service request.`,
    type: "SERVICE_REQUEST_CREATED"
  }),

  // Payment Notifications
  PAYMENT_SUCCESSFUL: (amount) => ({
    title: "Payment Successful! 💰",
    message: `Payment of ₹${amount} has been successfully processed.`,
    type: "PAYMENT_SUCCESSFUL"
  }),

  PAYMENT_FAILED: (amount) => ({
    title: "Payment Failed ❌",
    message: `Payment of ₹${amount} failed. Please try again.`,
    type: "PAYMENT_FAILED"
  }),

  // System Notifications
  ADMIN_BROADCAST: (title, message) => ({
    title: `📢 ${title}`,
    message,
    type: "ADMIN_BROADCAST"
  })
};

// Specific notification creators for different events
export const NotificationService = {
  // Service Request Events
  async notifyRequestAccepted(userId, electricianName) {
    const template = NotificationTemplates.REQUEST_ACCEPTED(electricianName);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyRequestStarted(userId, electricianName) {
    const template = NotificationTemplates.REQUEST_STARTED(electricianName);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyRequestCompleted(userId, electricianName) {
    const template = NotificationTemplates.REQUEST_COMPLETED(electricianName);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyRequestCancelled(userId, reason) {
    const template = NotificationTemplates.REQUEST_CANCELLED(reason);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  // Electrician Events
  async notifyElectricianApproved(userId) {
    const template = NotificationTemplates.ELECTRICIAN_APPROVED();
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyElectricianRejected(userId, reason) {
    const template = NotificationTemplates.ELECTRICIAN_REJECTED(reason);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyNewServiceRequest(electricianIds, userLocation, serviceType) {
    const template = NotificationTemplates.NEW_SERVICE_REQUEST(userLocation, serviceType);
    const notifications = [];
    
    for (const electricianId of electricianIds) {
      try {
        const notification = await createNotification(
          electricianId, 
          template.title, 
          template.message, 
          template.type
        );
        notifications.push(notification);
      } catch (error) {
        console.error(`Failed to notify electrician ${electricianId}:`, error);
      }
    }
    
    return notifications;
  },

  async notifyRequestAssigned(electricianId, userName) {
    const template = NotificationTemplates.REQUEST_ASSIGNED(userName);
    return await createNotification(electricianId, template.title, template.message, template.type);
  },

  // Admin Events
  async notifyNewElectricianApplication(adminIds, electricianName) {
    const template = NotificationTemplates.NEW_ELECTRICIAN_APPLICATION(electricianName);
    const notifications = [];
    
    for (const adminId of adminIds) {
      try {
        const notification = await createNotification(
          adminId, 
          template.title, 
          template.message, 
          template.type
        );
        notifications.push(notification);
      } catch (error) {
        console.error(`Failed to notify admin ${adminId}:`, error);
      }
    }
    
    return notifications;
  },

  async notifyServiceRequestCreated(adminIds, userName) {
    const template = NotificationTemplates.SERVICE_REQUEST_CREATED(userName);
    const notifications = [];
    
    for (const adminId of adminIds) {
      try {
        const notification = await createNotification(
          adminId, 
          template.title, 
          template.message, 
          template.type
        );
        notifications.push(notification);
      } catch (error) {
        console.error(`Failed to notify admin ${adminId}:`, error);
      }
    }
    
    return notifications;
  },

  // Payment Events
  async notifyPaymentSuccessful(userId, amount) {
    const template = NotificationTemplates.PAYMENT_SUCCESSFUL(amount);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  async notifyPaymentFailed(userId, amount) {
    const template = NotificationTemplates.PAYMENT_FAILED(amount);
    return await createNotification(userId, template.title, template.message, template.type);
  },

  // Admin Broadcast
  async notifyAllUsers(title, message, userIds) {
    const template = NotificationTemplates.ADMIN_BROADCAST(title, message);
    const notifications = [];
    
    for (const userId of userIds) {
      try {
        const notification = await createNotification(
          userId, 
          template.title, 
          template.message, 
          template.type
        );
        notifications.push(notification);
      } catch (error) {
        console.error(`Failed to notify user ${userId}:`, error);
      }
    }
    
    return notifications;
  }
};

export default NotificationService;
