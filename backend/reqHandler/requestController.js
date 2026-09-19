import requestSchema from "../model/requestmodel.js";
import itemSchema from "../model/itemmodel.js";
import reviewSchema from "../model/reviewmodel.js"
import { createNotification } from "./notificationController.js";

export async function sendRequest(req, res) {
  try {
    const borrower = req.user.UserID;
    const { itemId } = req.params;
    const { message, expectedReturnDate } = req.body;

    if (!itemId) {
      return res.status(400).send({
        msg: "Item ID is required",
      });
    }

    const itemCount = await itemSchema.countDocuments({
      owner: borrower,
    });

    if (itemCount < 3) {
      return res.status(400).send({
        msg: "You must add at least 3 items before borrowing.",
      });
    }

    const item = await itemSchema.findById(itemId);

    if (!item) {
      return res.status(404).send({
        msg: "Item not found",
      });
    }

    if (item.availability !== "Available") {
      return res.status(400).send({
        msg: "Item is not available",
      });
    }

    if (item.owner.toString() === borrower) {
      return res.status(400).send({
        msg: "You cannot borrow your own item",
      });
    }

    const existingRequest = await requestSchema.findOne({
      borrower,
      item: itemId,
      status: {
        $in: ["Pending", "Accepted"],
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "Pending") {
        return res.status(400).send({
          msg: "You already have a pending request for this item.",
        });
      }

      if (existingRequest.status === "Accepted") {
        return res.status(400).send({
          msg: "You are already borrowing this item.",
        });
      }
    }

    const newRequest = await requestSchema.create({
      item: itemId,
      borrower,
      owner: item.owner,
      message,
      expectedReturnDate,
    });

    await createNotification({
      recipient: item.owner,
      sender: borrower,
      title: "New Borrow Request",
      message: "You have received a new borrow request for your item.",
      type: "REQUEST",
      request: newRequest._id,
      item: item._id,
    });

    res.status(201).send({
      msg: "Borrow request sent successfully",
    });

  } catch (err) {
    console.log("Send request error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}
export async function getMyRequests(req, res) {
  try {
    const borrower = req.user.UserID;

    const requests = await requestSchema
      .find({ borrower })
      .populate("item")
      .populate("owner", "name village");

    const requestIds = requests.map(
      (request) => request._id
    );

    const reviews = await reviewSchema.find({
      request: { $in: requestIds },
      reviewer: borrower,
      type: "item",
    });

    const requestsWithReviews = requests.map(
      (request) => {

        const review = reviews.find(
          (review) =>
            review.request.toString() ===
            request._id.toString()
        );

        return {
          ...request.toObject(),

          review: review
            ? {
                exists: true,
                _id: review._id,
                rating: review.rating,
                review: review.review,
                createdAt: review.createdAt,
              }
            : {
                exists: false,
              },
        };
      }
    );

    res.status(200).send(requestsWithReviews);

  } catch (err) {
    console.log("Get my requests error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function getReceivedRequests(req, res) {
  try {
    const owner = req.user.UserID;

    const requests = await requestSchema
      .find({ owner })
      .populate("item")
      .populate(
        "borrower",
        "name email phone village address profileImage"
      );

    const requestIds = requests.map(
      (request) => request._id
    );

    const reviews = await reviewSchema.find({
      request: { $in: requestIds },
      reviewer: owner,
      type: "borrower",
    });

    const requestsWithReviews = requests.map(
      (request) => {

        const review = reviews.find(
          (review) =>
            review.request.toString() ===
            request._id.toString()
        );

        return {
          ...request.toObject(),

          review: review
            ? {
                exists: true,
                _id: review._id,
                rating: review.rating,
                review: review.review,
                createdAt: review.createdAt,
              }
            : {
                exists: false,
              },
        };
      }
    );

    res.status(200).send(requestsWithReviews);

  } catch (err) {
    console.log(
      "Get received requests error:",
      err
    );

    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function acceptRequest(req, res) {
  try {
    const { id } = req.params;
    const owner = req.user.UserID;

    const request = await requestSchema.findById(id);

    if (!request) {
      return res.status(404).send({
        msg: "Request not found",
      });
    }

    if (request.owner.toString() !== owner) {
      return res.status(403).send({
        msg: "You are not authorized",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).send({
        msg: "Request has already been processed",
      });
    }

    request.status = "Accepted";
    request.borrowDate = new Date();

    await request.save();

    await itemSchema.findByIdAndUpdate(request.item, {
      availability: "Borrowed",
    });

    await createNotification({
      recipient: request.borrower,
      sender: owner,
      title: "Borrow Request Accepted",
      message: "Your borrow request has been accepted by the item owner.",
      type: "REQUEST_ACCEPTED",
      request: request._id,
      item: request.item,
    });

    res.status(200).send({
      msg: "Request accepted successfully",
    });

  } catch (err) {
    console.log("Accept request error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}
export async function rejectRequest(req, res) {
  try {
    const { id } = req.params;
    const owner = req.user.UserID;

    const request = await requestSchema.findById(id);

    if (!request) {
      return res.status(404).send({
        msg: "Request not found",
      });
    }

    if (request.owner.toString() !== owner) {
      return res.status(403).send({
        msg: "You are not authorized",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).send({
        msg: "Request has already been processed",
      });
    }

    request.status = "Rejected";
    await request.save();

    await createNotification({
      recipient: request.borrower,
      sender: owner,
      title: "Borrow Request Rejected",
      message: "Your borrow request has been rejected by the item owner.",
      type: "REQUEST_REJECTED",
      request: request._id,
      item: request.item,
    });

    res.status(200).send({
      msg: "Request rejected successfully",
    });

  } catch (err) {
    console.log("Reject request error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function confirmReturn(req, res) {
  try {
    const { id } = req.params;
    const owner = req.user.UserID;

    const request = await requestSchema.findById(id);

    if (!request) {
      return res.status(404).send({
        msg: "Request not found",
      });
    }

    if (request.owner.toString() !== owner) {
      return res.status(403).send({
        msg: "You are not authorized",
      });
    }

    if (request.status !== "Accepted") {
      return res.status(400).send({
        msg: "Item is not currently borrowed",
      });
    }

    request.status = "Returned";
    request.actualReturnDate = new Date();

    await request.save();

    await itemSchema.findByIdAndUpdate(request.item, {
      availability: "Available",
    });

    await createNotification({
      recipient: request.borrower,
      sender: owner,
      title: "Item Return Confirmed",
      message: "The item owner has confirmed that the borrowed item was returned.",
      type: "ITEM_RETURNED",
      request: request._id,
      item: request.item,
    });

    res.status(200).send({
      msg: "Item returned successfully",
    });

  } catch (err) {
    console.log("Confirm return error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}