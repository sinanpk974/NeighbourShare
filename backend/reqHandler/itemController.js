import itemSchema from "../model/itemmodel.js";
import { createNotification } from "./notificationController.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";


// ======================================================
// ADD ITEM
// ======================================================

export async function addItem(req, res) {
  const {
    title,
    category,
    description,
    condition,
  } = req.body;

  const owner = req.user.UserID;

  if (!title || !category || !description || !condition) {
    return res.status(400).send({
      msg: "Invalid input",
    });
  }

  if (!req.file) {
    return res.status(400).send({
      msg: "Item image is required",
    });
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResult =
      await uploadToCloudinary(
        req.file.buffer,
        "neighbourshare/items"
      );

    const imageUrl = cloudinaryResult.secure_url;
    const imagePublicId = cloudinaryResult.public_id;

    await itemSchema.create({
      owner,
      title,
      category,
      description,
      image: imageUrl,
      imagePublicId,
      condition,
    });

    res.status(201).send({
      msg: "Item added successfully",
      image: imageUrl,
    });

  } catch (err) {
    console.log("Add item error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}


// ======================================================
// GET ALL ITEMS
// ======================================================

export async function getItems(req, res) {
  try {
    const items = await itemSchema
      .find()
      .populate("owner", "name email");

    res.status(200).send(items);

  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}


// ======================================================
// GET SINGLE ITEM
// ======================================================

export async function getSingleItem(req, res) {
  try {
    const { id } = req.params;

    const item = await itemSchema.findById(id);

    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).send({
      success: true,
      item,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}


// ======================================================
// GET MY ITEMS
// ======================================================

export async function getMyItems(req, res) {
  try {
    const owner = req.user.UserID;

    const items = await itemSchema.find({ owner });

    res.status(200).send(items);

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}


// ======================================================
// UPDATE ITEM
// ======================================================

export async function updateItem(req, res) {
  const { id } = req.params;
  const owner = req.user.UserID;

  const {
    title,
    category,
    description,
    condition,
  } = req.body;

  try {
    // Find item owned by logged-in user
    const existingItem = await itemSchema.findOne({
      _id: id,
      owner,
    });

    if (!existingItem) {
      return res.status(404).send({
        msg: "Item not found or you are not authorized",
      });
    }


    // -----------------------------------------------
    // If a new image was selected
    // -----------------------------------------------

    let imageUrl = existingItem.image;
    let imagePublicId = existingItem.imagePublicId;

    if (req.file) {

      // Upload new image
      const cloudinaryResult =
        await uploadToCloudinary(
          req.file.buffer,
          "neighbourshare/items"
        );

      imageUrl = cloudinaryResult.secure_url;
      imagePublicId = cloudinaryResult.public_id;


      // Delete old image from Cloudinary
      if (existingItem.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            existingItem.imagePublicId
          );
        } catch (cloudinaryError) {
          console.log(
            "Old item image deletion error:",
            cloudinaryError.message
          );
        }
      }
    }


    // -----------------------------------------------
    // Update item
    // -----------------------------------------------

    existingItem.title =
      title || existingItem.title;

    existingItem.category =
      category || existingItem.category;

    existingItem.description =
      description || existingItem.description;

    existingItem.condition =
      condition || existingItem.condition;

    existingItem.image = imageUrl;
    existingItem.imagePublicId = imagePublicId;

    await existingItem.save();


    res.status(200).send({
      msg: "Item updated successfully",
      item: existingItem,
    });

  } catch (err) {
    console.log("Update item error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
}


// ======================================================
// DELETE ITEM
// ======================================================

export async function deleteItem(req, res) {
  const { id } = req.params;
  const owner = req.user.UserID;

  try {

    // Find item first
    const item = await itemSchema.findOne({
      _id: id,
      owner,
    });

    if (!item) {
      return res.status(404).send({
        msg: "Item not found or you are not authorized",
      });
    }


    // -----------------------------------------------
    // Delete image from Cloudinary
    // -----------------------------------------------

    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          item.imagePublicId
        );
      } catch (cloudinaryError) {
        console.log(
          "Cloudinary image deletion error:",
          cloudinaryError.message
        );
      }
    }


    // -----------------------------------------------
    // Delete item from MongoDB
    // -----------------------------------------------

    await itemSchema.findByIdAndDelete(id);


    res.status(200).send({
      msg: "Item deleted successfully",
    });

  } catch (err) {
    console.log("Delete item error:", err);

    res.status(500).send({
      msg: err.message,
    });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { title, category, availability } = req.query;

    const filter = {};

    if (title || category) {
      const searchValue = title || category;

      filter.$or = [
        {
          title: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    if (availability) {
      filter.availability = {
        $regex: `^${availability}$`,
        $options: "i",
      };
    }

    const items = await itemSchema
      .find(filter)
      .populate("owner", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Items fetched successfully.",
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};