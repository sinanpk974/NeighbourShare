import notificationSchemaModel from "../model/notificationmodel.js";

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

    const notification = await notificationSchemaModel.create({
      recipient,
      sender,
      title,
      message,
      type,
      request,
      item,
      review,
    });

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