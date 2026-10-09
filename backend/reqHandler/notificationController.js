import notificationSchemaModel from "../model/notificationmodel.js";
import { getIO } from "../socket.js";

export async function createNotification({
  recipient,
  sender = null,
  title,
  message,
  type = "GENERAL",
  request = null,
  item = null,
  review = null,
}) {
  try {
    if (!recipient || !title || !message) {
      console.log(
        "Notification creation failed: Missing required fields"
      );

      return null;
    }

    // ==========================================
    // SAVE NOTIFICATION TO DATABASE
    // ==========================================

    const notification =
      await notificationSchemaModel.create({
        recipient,
        sender,
        title,
        message,
        type,
        request,
        item,
        review,
      });

    // ==========================================
    // SEND REAL-TIME NOTIFICATION
    // ==========================================

    try {
      const io = getIO();

      const roomName = `user:${recipient}`;

      io.to(roomName).emit(
        "newNotification",
        notification
      );

      console.log(
        `Real-time notification sent to ${roomName}`
      );
    } catch (socketError) {
      console.log(
        "Socket notification error:",
        socketError.message
      );
    }

    return notification;

  } catch (error) {
    console.log(
      "Notification creation error:",
      error.message
    );

    return null;
  }
}

export async function getNotifications(req, res) {
  try {
    const userId = req.user.UserID;

    const notifications =
      await notificationSchemaModel
        .find({
          recipient: userId,
        })
        .populate(
          "sender",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).send({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    console.log(
      "Get notifications error:",
      error
    );

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function markNotificationAsRead(
  req,
  res
) {
  try {
    const userId = req.user.UserID;
    const { id } = req.params;

    const notification =
      await notificationSchemaModel.findOne({
        _id: id,
        recipient: userId,
      });

    if (!notification) {
      return res.status(404).send({
        success: false,
        message:
          "Notification not found or unauthorized",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).send({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });

  } catch (error) {
    console.log(
      "Mark notification as read error:",
      error
    );

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function markAllNotificationsAsRead(
  req,
  res
) {
  try {
    const userId = req.user.UserID;

    const result =
      await notificationSchemaModel.updateMany(
        {
          recipient: userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

    res.status(200).send({
      success: true,
      message:
        "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });

  } catch (error) {
    console.log(
      "Mark all notifications as read error:",
      error
    );

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function getUnreadNotificationCount(
  req,
  res
) {
  try {
    const userId = req.user.UserID;

    const unreadCount =
      await notificationSchemaModel.countDocuments({
        recipient: userId,
        isRead: false,
      });

    res.status(200).send({
      success: true,
      unreadCount,
    });

  } catch (error) {
    console.log(
      "Get unread notification count error:",
      error
    );

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

import jwt from "jsonwebtoken";

export async function getRegistrationNotifications(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Registration status token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.REGISTRATION_STATUS_SECRET
      );
    } catch {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired registration status token",
      });
    }

    if (
      decoded.purpose !== "registration-status" ||
      !decoded.userId
    ) {
      return res.status(401).send({
        success: false,
        message: "Invalid registration status token",
      });
    }

    const notifications = await notificationSchemaModel
      .find({
        recipient: decoded.userId,
        type: {
          $in: [
            "USER_VERIFIED",
            "USER_REJECTED",
            "USER_BLOCKED",
            "USER_UNBLOCKED",
          ],
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Registration notifications error:", error);

    return res.status(500).send({
      success: false,
      message: "Failed to fetch registration notifications",
    });
  }
}