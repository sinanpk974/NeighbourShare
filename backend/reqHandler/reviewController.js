import reviewSchema from "../model/reviewmodel.js";
import requestSchema from "../model/requestmodel.js";
import itemSchema from "../model/itemmodel.js";
import { createNotification } from "./notificationController.js";

export async function addReview(req, res) {
  try {
    const reviewer = req.user.UserID;
    const { requestId } = req.params;
    const { type, rating, review } = req.body;

    if (!(type && rating)) {
      return res.status(400).send({
        msg: "Type and rating are required",
      });
    }
    if (!["item", "borrower"].includes(type)) {
      return res.status(400).send({
        msg: "Invalid review type",
      });
    }

    const request = await requestSchema.findById(requestId);

    if (!request) {
      return res.status(404).send({
        msg: "Request not found",
      });
    }

    if (request.status !== "Returned") {
      return res.status(400).send({
        msg: "Review can only be added after the item is returned",
      });
    }

    if (
      request.owner.toString() !== reviewer &&
      request.borrower.toString() !== reviewer
    ) {
      return res.status(403).send({
        msg: "You are not authorized",
      });
    }

    const existingReview = await reviewSchema.findOne({
      request: requestId,
      reviewer,
      type,
    });

    if (existingReview) {
      return res.status(400).send({
        msg: "You have already submitted this review",
      });
    }

    let item = null;
    let reviewFor = null;
    let notificationRecipient = null;
    let notificationTitle = "";
    let notificationMessage = "";

    if (type === "item") {
      if (request.borrower.toString() !== reviewer) {
        return res.status(403).send({
          msg: "Only borrower can review the item",
        });
      }

      item = request.item;
      notificationRecipient = request.owner;

      notificationTitle = "New Item Review";
      notificationMessage =
        "Your item has received a new review from the borrower.";
    }

    else if (type === "borrower") {
      if (request.owner.toString() !== reviewer) {
        return res.status(403).send({
          msg: "Only owner can review the borrower",
        });
      }

      reviewFor = request.borrower;
      notificationRecipient = request.borrower;

      notificationTitle = "New Review Received";
      notificationMessage =
        "You have received a new review from the item owner.";
    }

    const newReview = await reviewSchema.create({
      request: requestId,
      reviewer,
      type,
      item,
      reviewFor,
      rating,
      review,
    });

    await createNotification({
      recipient: notificationRecipient,
      sender: reviewer,
      title: notificationTitle,
      message: notificationMessage,
      type: "REVIEW",
      request: request._id,
      item: request.item,
      review: newReview._id,
    });

    res.status(201).send({
      msg: "Review added successfully",
    });

  } catch (err) {
    console.log("Add review error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function getItemReviews(req, res) {
  try {
    const { itemId } = req.params;

    const reviews = await reviewSchema
      .find({
        item: itemId,
        type: "item",
      })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        : 0;

    res.status(200).send({
      success: true,
      averageRating: Number(
        averageRating.toFixed(1)
      ),
      totalReviews,
      reviews,
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
}

export async function getUserReviews(req, res) {
  try {
    const { userId } = req.params;

    const reviews = await reviewSchema
      .find({
        reviewFor: userId,
        type: "borrower",
      })
      .populate("reviewer", "name")
      .populate("item", "title")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        : 0;

    res.status(200).send({
      success: true,
      averageRating: Number(
        averageRating.toFixed(1)
      ),
      totalReviews,
      reviews,
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
}

export async function getMyReviews(req, res) {
  try {
    const userId = req.user.UserID;

    const myItems = await itemSchema
      .find({
        owner: userId,
      })
      .select("_id title");

    const itemIds = myItems.map(
      (item) => item._id
    );

    const borrowerReviews = await reviewSchema
      .find({
        reviewFor: userId,
        type: "borrower",
      })
      .populate("reviewer", "name")
      .populate("item", "title")
      .sort({ createdAt: -1 });

    const itemReviews = await reviewSchema
      .find({
        item: {
          $in: itemIds,
        },
        type: "item",
      })
      .populate("reviewer", "name")
      .populate("item", "title")
      .sort({ createdAt: -1 });

    const borrowerTotal =
      borrowerReviews.length;

    const borrowerAverage =
      borrowerTotal > 0
        ? borrowerReviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / borrowerTotal
        : 0;

    const itemTotal =
      itemReviews.length;

    const itemAverage =
      itemTotal > 0
        ? itemReviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / itemTotal
        : 0;

    res.status(200).send({
      success: true,
      borrowerReviews,
      itemReviews,
      borrowerRating: Number(
        borrowerAverage.toFixed(1)
      ),

      borrowerReviewCount:
        borrowerTotal,
      itemRating: Number(
        itemAverage.toFixed(1)
      ),

      itemReviewCount:
        itemTotal,
      totalReviews:
        borrowerTotal +
        itemTotal,
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
}

export async function getReviewByRequest(req, res) {
  try {
    const reviewer = req.user.UserID;
    const { requestId, type } = req.params;

    if (!["item", "borrower"].includes(type)) {
      return res.status(400).send({
        msg: "Invalid review type",
      });
    }

    const review = await reviewSchema
      .findOne({
        request: requestId,
        reviewer,
        type,
      })
      .populate("item", "title image")
      .populate("reviewFor", "name profileImage");

    if (!review) {
      return res.status(404).send({
        msg: "Review not found",
      });
    }

    res.status(200).send(review);

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function getReviewById(req, res) {
  try {
    const { reviewId } = req.params;

    const review = await reviewSchema
      .findById(reviewId)
      .populate("reviewer", "name profileImage")
      .populate("item", "title image")
      .populate("reviewFor", "name profileImage");

    if (!review) {
      return res.status(404).send({
        msg: "Review not found",
      });
    }

    res.status(200).send(review);

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function getReviewsByRequest(req, res) {
  try {
    const userId = req.user.UserID;
    const { requestId } = req.params;

    const request = await requestSchema.findById(requestId);

    if (!request) {
      return res.status(404).send({
        success: false,
        msg: "Request not found",
      });
    }

    const isOwner =
      request.owner.toString() === userId.toString();

    const isBorrower =
      request.borrower.toString() === userId.toString();

    if (!isOwner && !isBorrower) {
      return res.status(403).send({
        success: false,
        msg: "You are not authorized",
      });
    }

    const reviews = await reviewSchema
      .find({
        request: requestId,
      })
      .populate("reviewer", "name profileImage")
      .populate("item", "title image")
      .populate("reviewFor", "name profileImage")
      .sort({ createdAt: -1 });

    const givenReview = reviews.find(
      (review) =>
        review.reviewer?._id?.toString() ===
        userId.toString()
    );

    let receivedReview = null;

    if (isBorrower) {
      receivedReview = reviews.find(
        (review) =>
          review.type === "borrower" &&
          review.reviewFor?._id?.toString() ===
            userId.toString()
      );
    }

    if (isOwner) {
      receivedReview = reviews.find(
        (review) =>
          review.type === "item" &&
          review.reviewer?._id?.toString() !==
            userId.toString()
      );
    }

    res.status(200).send({
      success: true,
      givenReview: givenReview || null,
      receivedReview: receivedReview || null,
    });

  } catch (err) {
    console.log("Get reviews by request error:", err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
}