import  express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { deleteNotification, getMyNotifications, markNotificationAsRead } from '../controllers/Notification.controller.js';

const notificationRouter = express.Router();

//get all notifcations
notificationRouter.get(
  "/",
  authMiddleware,
  getMyNotifications
);

//mark notification read
notificationRouter.patch(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);
//delete notification
notificationRouter.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);


export default notificationRouter;