import itemSchema from "../model/itemmodel.js";
import { createNotification } from "./notificationController.js";

export async function addItem(req, res) {
  const {
    title,
    category,
    description,
    image,
    condition,
  } = req.body;

  const owner = req.user.UserID;

  if (!(title && category && description && image && condition)) {
    return res.status(400).send({ msg: "Invalid input" });
  }

  try {
    await itemSchema.create({
      owner,
      title,
      category,
      description,
      image,
      condition,
    });

    res.status(201).send({
      msg: "Item added successfully",
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

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

export async function updateItem(req, res) {
  const { id } = req.params;
  const owner = req.user.UserID;

  const {
    title,
    category,
    description,
    image,
    condition,
  } = req.body;

  try {
    const updatedItem = await itemSchema.findOneAndUpdate(
      { _id: id, owner },
      {
        $set: {
          ...(title && { title }),
          ...(category && { category }),
          ...(description && { description }),
          ...(image && { image }),
          ...(condition && { condition }),
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send({
        msg: "Item not found or you are not authorized",
      });
    }

    res.status(200).send({
      msg: "Item updated successfully",
      item: updatedItem,
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

export async function deleteItem(req, res) {
  const { id } = req.params;
  const owner = req.user.UserID;

  try {
    const deletedItem = await itemSchema.findOneAndDelete({
      _id: id,
      owner,
    });

    if (!deletedItem) {
      return res.status(404).send({
        msg: "Item not found or you are not authorized",
      });
    }

    res.status(200).send({
      msg: "Item deleted successfully",
    });

  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
}

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