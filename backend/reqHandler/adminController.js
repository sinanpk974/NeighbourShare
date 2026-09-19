import itemSchema from "../model/itemmodel.js";
import userSchema from "../model/usermodel.js"
import requestSchema from "../model/requestmodel.js"
import reviewSchema from "../model/reviewmodel.js"
import { createNotification } from "./notificationController.js";

export async function getProfile(req, res) {
    try {
        const data = await userSchema.find({
            _id: { $ne: req.user.UserID }
        });

        res.status(200).send({
            success: true,
            users: data
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

export async function getSingleUser(req, res) {
    try {

        const { id } = req.params;

        const user = await userSchema.findById(id).select("-password");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const items = await itemSchema.find({ owner: id });

        const sentRequests = await requestSchema.find({
            borrower: id
        }).populate("item owner");

        const receivedRequests = await requestSchema.find({
            owner: id
        }).populate("item borrower");

        const reviews = await reviewSchema.find({
            reviewType: "user",
            targetId: id
        }).populate("reviewer", "name");

        res.status(200).send({
            success: true,
            user,
            items,
            sentRequests,
            receivedRequests,
            reviews
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}

export async function getPendingUsers(req, res) {
    try {

        const users = await userSchema
            .find({ verificationStatus: "Pending" })
            .select("-password");

        res.status(200).send({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}
export async function verifyUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationStatus === "Verified") {
      return res.status(400).send({
        success: false,
        message: "User is already verified",
      });
    }

    user.isVerified = true;
    user.verificationStatus = "Verified";

    await user.save();

    await createNotification({
      recipient: user._id,
      title: "Account Verified",
      message:
        "Your account has been verified successfully. You can now use all available features.",
      type: "USER_VERIFIED",
    });

    return res.status(200).send({
      success: true,
      message: "User verified successfully",
      user,
    });

  } catch (error) {
    console.log("Verify user error:", error);

    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function rejectUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationStatus === "Verified") {
      return res.status(400).send({
        success: false,
        message: "Verified users cannot be rejected",
      });
    }

    if (user.verificationStatus === "Rejected") {
      return res.status(400).send({
        success: false,
        message: "User is already rejected",
      });
    }

    user.isVerified = false;
    user.verificationStatus = "Rejected";

    await user.save();

    await createNotification({
      recipient: user._id,
      sender: req.user.UserID,
      title: "Account Verification Rejected",
      message:
        "Your account verification request has been rejected. Please contact the administrator if you need more information.",
      type: "USER_REJECTED",
    });

    return res.status(200).send({
      success: true,
      message: "User verification rejected successfully",
      user,
    });

  } catch (error) {
    console.log("Reject user error:", error);

    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function blockUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.UserID === id) {
      return res.status(400).send({
        success: false,
        message: "You cannot block or unblock your own account.",
      });
    }

    const user = await userSchema.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isBlocked) {
      return res.status(400).send({
        success: false,
        message: "User is already blocked.",
      });
    }

    user.isBlocked = true;

    await user.save();

    await createNotification({
      recipient: user._id,
      sender: req.user.UserID,
      title: "Account Blocked",
      message:
        "Your account has been blocked by the administrator. Please contact the administrator for more information.",
      type: "USER_BLOCKED",
    });

    res.status(200).send({
      success: true,
      message: "User blocked successfully.",
    });

  } catch (error) {
    console.log("Block user error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}


export async function unblockUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.UserID === id) {
      return res.status(400).send({
        success: false,
        message: "You cannot block or unblock your own account.",
      });
    }

    const user = await userSchema.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isBlocked) {
      return res.status(400).send({
        success: false,
        message: "User is not blocked.",
      });
    }

    user.isBlocked = false;

    await user.save();

    await createNotification({
      recipient: user._id,
      sender: req.user.UserID,
      title: "Account Unblocked",
      message:
        "Your account has been unblocked by the administrator. You can now access the platform again.",
      type: "USER_UNBLOCKED",
    });

    res.status(200).send({
      success: true,
      message: "User unblocked successfully.",
    });

  } catch (error) {
    console.log("Unblock user error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteUser(req, res) {
    try {

        const { id } = req.params;

        if (req.user.UserID === id) {
            return res.status(400).send({
                success: false,
                message: "You cannot delete your own account."
            });
        }

        const user = await userSchema.findById(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found."
            });
        }
        const activeBorrow = await requestSchema.findOne({
    status: "Accepted",
    $or: [
        { owner: id },
        { borrower: id }
    ]
});

if (activeBorrow) {
    return res.status(400).send({
        success: false,
        message: "Cannot delete a user with an active borrowing transaction."
    });
}

        await itemSchema.deleteMany({ owner: id });

        await requestSchema.deleteMany({
            $or: [
                { owner: id },
                { borrower: id }
            ]
        });

        await reviewSchema.deleteMany({
            $or: [
                { reviewer: id },
                {
                    reviewType: "user",
                    targetId: id
                }
            ]
        });

        await userSchema.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "User and all related data deleted successfully."
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}

export async function adminDashboard(req, res) {
    try {

        const userFilter = {
            role: { $ne: "admin" }
        };

        const totalUsers = await userSchema.countDocuments(userFilter);

        const pendingUsers = await userSchema.countDocuments({
            ...userFilter,
            verificationStatus: "Pending"
        });

        const verifiedUsers = await userSchema.countDocuments({
            ...userFilter,
            verificationStatus: "Verified"
        });

        const blockedUsers = await userSchema.countDocuments({
            ...userFilter,
            isBlocked: true
        });

        const totalItems = await itemSchema.countDocuments();

        const availableItems = await itemSchema.countDocuments({
            availability: "Available"
        });

        const borrowedItems = await itemSchema.countDocuments({
            availability: "Borrowed"
        });

        const totalRequests = await requestSchema.countDocuments();

        const pendingRequests = await requestSchema.countDocuments({
            status: "Pending"
        });

        const acceptedRequests = await requestSchema.countDocuments({
            status: "Accepted"
        });

        const rejectedRequests = await requestSchema.countDocuments({
            status: "Rejected"
        });

        const returnedRequests = await requestSchema.countDocuments({
            status: "Returned"
        });

        const totalReviews = await reviewSchema.countDocuments();

        res.status(200).send({
            success: true,
            dashboard: {
                users: {
                    totalUsers,
                    pendingUsers,
                    verifiedUsers,
                    blockedUsers
                },
                items: {
                    totalItems,
                    availableItems,
                    borrowedItems
                },
                requests: {
                    totalRequests,
                    pendingRequests,
                    acceptedRequests,
                    rejectedRequests,
                    returnedRequests
                },
                reviews: {
                    totalReviews
                }
            }
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}

export async function deleteAnyItem(req, res) {
  try {
    const { id } = req.params;

    const item = await itemSchema.findById(id);

    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found.",
      });
    }
    const itemOwner = item.owner;

    await requestSchema.deleteMany({
      item: id,
    });

    await reviewSchema.deleteMany({
      type: "item",
      item: id,
    });

    await itemSchema.findByIdAndDelete(id);

    await createNotification({
      recipient: itemOwner,
      sender: req.user.UserID,
      title: "Item Removed by Admin",
      message: `Your item "${item.title}" has been removed by the administrator.`,
      type: "ITEM_DELETED_BY_ADMIN",
      item: null,
    });

    res.status(200).send({
      success: true,
      message: "Item deleted successfully.",
    });

  } catch (error) {
    console.log("Delete item error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}
export async function getAllRequests(req, res) {
    try {

        const requests = await requestSchema
            .find()
            .populate("item", "title category")
            .populate("owner", "name email")
            .populate("borrower", "name email")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}

export async function getAllReviews(req, res) {
    try {

        const reviews = await reviewSchema
            .find()
            .populate("reviewer", "name email")
            .populate("item", "title category")
            .populate("reviewFor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await reviewSchema.findById(id);

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found.",
      });
    }
    const reviewer = review.reviewer;

    await reviewSchema.findByIdAndDelete(id);

    await createNotification({
      recipient: reviewer,
      sender: req.user.UserID,
      title: "Review Removed by Admin",
      message:
        "Your review has been removed by the administrator.",
      type: "REVIEW_DELETED_BY_ADMIN",
      review: null,
    });

    res.status(200).send({
      success: true,
      message: "Review deleted successfully.",
    });

  } catch (error) {
    console.log("Delete review error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}
export async function getPendingDeletions(req, res) {
  try {
    const users = await userSchema
      .find({ deletionStatus: "Pending" })
      .select("-password")
      .sort({ _id: -1 });

    res.status(200).send({
      msg: "Pending deletion requests fetched successfully",
      count: users.length,
      users,
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function approveDeletion(req, res) {
  const userId = req.params.id;

  try {
    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }
    if (user.deletionStatus !== "Pending") {
      return res.status(400).send({
        msg: "No pending deletion request for this user",
      });
    }
    const activeBorrowing = await requestSchema.findOne({
      borrower: userId,
      status: "Accepted",
    });

    if (activeBorrowing) {
      return res.status(400).send({
        msg: "Account cannot be deleted because the user has an active borrowed item",
      });
    }
    await itemSchema.deleteMany({
      owner: userId,
    });
    await requestSchema.deleteMany({
      $or: [
        { borrower: userId },
        { owner: userId },
      ],
    });
    await reviewSchema.deleteMany({
      reviewer: userId,
    });
    await userSchema.findByIdAndDelete(userId);

    res.status(200).send({
      msg: "Account deletion approved and account deleted successfully",
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function rejectDeletion(req, res) {
  const userId = req.params.id;

  try {

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }

    if (user.deletionStatus !== "Pending") {
      return res.status(400).send({
        msg: "No pending deletion request for this user",
      });
    }

    user.deletionStatus = "Rejected";

    await user.save();

    await createNotification({
      recipient: user._id,
      sender: req.user.UserID,
      title: "Account Deletion Request Rejected",
      message:
        "Your account deletion request has been rejected. Your account will remain active.",
      type: "ACCOUNT_DELETION_REJECTED",
    });

    res.status(200).send({
      msg: "Account deletion request rejected successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        deletionStatus: user.deletionStatus,
      },
    });

  } catch (err) {
    console.log("REJECT DELETION ERROR:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}
export async function getAdminProfile(req, res) {
  try {
    const admin = await userSchema
      .findById(req.user.UserID)
      .select("-password");

    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).send({
      success: true,
      admin,
    });
  } catch (error) {
    console.log("Get admin profile error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}