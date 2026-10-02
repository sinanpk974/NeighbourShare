import itemSchema from"../model/itemmodel.js";
import userSchema from "../model/usermodel.js";
import reviewSchema from "../model/reviewmodel.js"
import requestSchema from "../model/requestmodel.js"
import notificationSchema from "../model/notificationmodel.js"
import bcrypt from 'bcrypt'
import pkg from 'jsonwebtoken'
import { createNotification } from "./notificationController.js";

const {sign} = pkg

export async function Register(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      village,
      address,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !village ||
      !address
    ) {
      return res.status(400).send({
        msg: "All fields are required",
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        msg: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userSchema.create({
      name,
      email,
      password: hashedPassword,
      phone,
      village,
      address,
    });

    const admins = await userSchema.find({
      role: "admin",
    });

    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: newUser._id,
        title: "New User Registration",
        message: `${newUser.name} has registered and is waiting for account verification.`,
        type: "NEW_USER_REGISTRATION",
      });
    }

    res.status(201).send({
      msg: "Registration successful",
    });

  } catch (err) {
    console.log("Register error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}
export async function Login(req, res) {
  const { email, password } = req.body;

  if (!(email && password))
    return res.status(400).send({ msg: "Invalid input" });

  const user = await userSchema.findOne({ email });

  if (!user)
    return res.status(404).send({ msg: "User does not exist" });

  const success = await bcrypt.compare(password, user.password);

  if (!success)
    return res.status(401).send({ msg: "Incorrect password" });

  if (!user.isVerified ||user.isBlocked)
    return res.status(403).send({
      msg: "Your account is waiting for admin verification",
    });

  const token = sign(
    { UserID: user._id ,
      role: user.role
    },
    process.env.JWT_KEY,
    { expiresIn: "48h" }
  );

  res.status(200).send({
  msg: "Login successful",
  token: token,
  role: user.role,
});

}
export async function checkVerificationStatus(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        msg: "Email is required",
      });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).send({
        msg: "User does not exist",
      });
    }

    // Account is verified
    if (user.isVerified) {
      return res.status(200).send({
        success: true,
        status: "verified",
        msg: "Your account has been verified. You can now login.",
      });
    }

    // Account is blocked
    if (user.isBlocked) {
      return res.status(200).send({
        success: true,
        status: "blocked",
        msg: "Your account has been blocked by the administrator.",
      });
    }

    // Check latest rejection notification
    const rejectionNotification = await notificationSchema
      .findOne({
        recipient: user._id,
        type: "USER_REJECTED",
      })
      .sort({ createdAt: -1 });

    if (rejectionNotification) {
      return res.status(200).send({
        success: true,
        status: "rejected",
        msg: rejectionNotification.message,
      });
    }

    // Still waiting
    return res.status(200).send({
      success: true,
      status: "pending",
      msg: "Your account is still waiting for admin verification.",
    });

  } catch (err) {
    console.log("Check verification status error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}




export async function getmyProfile(req, res) {
  try {
    const userId = req.user.UserID;

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }

    res.status(200).send(user);

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}


export async function updateProfile(req, res) {
  const userId = req.user.UserID;

  const {
    name,
    email,
    password,
    phone,
    village,
    address,
    profileImage,
  } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (village !== undefined) updateData.village = village;
    if (address !== undefined) updateData.address = address;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (password !== undefined && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({
        msg: "User not found",
      });
    }

    res.status(200).send({
      msg: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function deleteAccount(req, res) {
  const userId = req.user.UserID;

  try {

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }

    if (user.deletionStatus === "Pending") {
      return res.status(400).send({
        msg: "Your account deletion request is already pending",
      });
    }

    user.deletionStatus = "Pending";

    await user.save();

    const admins = await userSchema.find({
      role: "admin",
    });

    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: user._id,
        title: "Account Deletion Request",
        message: `${user.name} has requested to delete their account.`,
        type: "ACCOUNT_DELETION_REQUEST",
      });
    }

    res.status(200).send({
      msg: "Account deletion request sent to admin successfully",
    });

  } catch (err) {
    console.log("Delete account request error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}
export async function getPublicProfile(req, res) {
    try {
        const { id } = req.params;

        const user = await userSchema
            .findById(id)
            .select("name village profileImage");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const items = await itemSchema.find({
            owner: id,
            availability: "Available"
        });

        const reviews = await reviewSchema.find({
            reviewType: "user",
            targetId: id
        });

        const totalReviews = reviews.length;

        const averageRating =
            totalReviews > 0
                ? (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      totalReviews
                  ).toFixed(1)
                : 0;

        res.status(200).send({
            success: true,
            profile: user,
            averageRating,
            totalReviews,
            items
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

export async function getContactDetails(req, res) {
    try {
        const currentUserId = req.user.UserID;
        const otherUserId = req.params.id;

        const request = await requestSchema.findOne({
            status: "Accepted",
            $or: [
                {
                    owner: otherUserId,
                    borrower: currentUserId
                },
                {
                    owner: currentUserId,
                    borrower: otherUserId
                }
            ]
        });

        if (!request) {
            return res.status(403).send({
                success: false,
                message: "You are not authorized to view contact details."
            });
        }

        const user = await userSchema
            .findById(otherUserId)
            .select("name phone address village");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).send({
            success: true,
            contact: user
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}