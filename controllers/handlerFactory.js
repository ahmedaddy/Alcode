const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const path = require("path");
const fs = require("fs");
const url = require("url");
// Utility function to delete an image
const deleteImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`Not Found Document For This ID : ${id}`, 404));
    }

    const oldImage = document.questionImage;
    const oldAudio = document.audio;
    // console.log(oldImage);
    // console.log(oldAudio);

    // If the old image is a URL, convert it to a file path
    const oldImagePath = oldImage
      ? path.join(
          __dirname,
          "../uploads/question",
          path.basename(new url.URL(oldImage).pathname)
        )
      : null;
    const oldAudioPath = oldAudio
      ? path.join(
          __dirname,
          "../uploads/audios",
          path.basename(new url.URL(oldAudio).pathname)
        )
      : null;

    if (oldImagePath) {
      try {
        // Log the path to ensure it is correct
        // console.log(`Attempting to delete old image at path: ${oldImagePath}`);

        // Ensure the file exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
          await deleteImage(oldImagePath);
          // console.log(`Old image ${oldImage} deleted successfully`);
        } else {
          console.warn(
            `Old image ${oldImage} not found at path ${oldImagePath}`
          );
        }
      } catch (err) {
        console.error(`Error deleting old image ${oldImage}:`, err);
        return res.status(500).json({ message: "Failed to delete old image" });
      }
    }
    if (oldAudioPath) {
      try {
        // Log the path to ensure it is correct
        // console.log(`Attempting to delete old audio at path: ${oldAudioPath}`);

        // Ensure the file exists before attempting to delete
        if (fs.existsSync(oldAudioPath)) {
          await deleteImage(oldAudioPath);
          // console.log(`Old audio ${oldAudio} deleted successfully`);
        } else {
          console.warn(
            `Old audio ${oldAudio} not found at path ${oldAudioPath}`
          );
        }
      } catch (err) {
        console.error(`Error deleting old audio ${oldAudio}:`, err);
        return res.status(500).json({ message: "Failed to delete old audio" });
      }
    }
    const deleteDocument = await Model.findByIdAndDelete(id);

    if (!deleteDocument) {
      return next(new ApiError(`Not Found Document For This ID : ${id}`, 404));
    }

    res.status(204).json({ success: true, data: deleteDocument });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
      questionImage: newImage,
      audio: newAudio,
      ...updateData
    } = req.body;

    // Retrieve the existing document to get the old image path
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`Not Found Document For This ID : ${id}`, 404));
    }

    // Extract the old image URL and convert it to a file path
    const oldImage = document.questionImage;
    const oldAudio = document.audio;

    // If the old image is a URL, convert it to a file path
    const oldImagePath = oldImage
      ? path.join(
          __dirname,
          "../uploads/question",
          path.basename(new url.URL(oldImage).pathname)
        )
      : null;
    const oldAudioPath = oldAudio
      ? path.join(
          __dirname,
          "../uploads/audios",
          path.basename(new url.URL(oldAudio).pathname)
        )
      : null;
    if (req.body.questionImage) {
      if (oldImagePath && oldImagePath !== newImage) {
        try {
          // Log the path to ensure it is correct
          // console.log(
          //   `Attempting to delete old image at path: ${oldImagePath}`
          // );

          // Ensure the file exists before attempting to delete
          if (fs.existsSync(oldImagePath)) {
            await deleteImage(oldImagePath);
            // console.log(`Old image ${oldImage} deleted successfully`);
          } else {
            console.warn(
              `Old image ${oldImage} not found at path ${oldImagePath}`
            );
          }
        } catch (err) {
          console.error(`Error deleting old image ${oldImage}:`, err);
          return res
            .status(500)
            .json({ message: "Failed to delete old image" });
        }
      }
    }
    if (req.body.audio) {
      if (oldAudioPath && oldAudioPath !== newAudio) {
        try {
          // Log the path to ensure it is correct
          // console.log(
          //   `Attempting to delete old audio at path: ${oldAudioPath}`
          // );

          // Ensure the file exists before attempting to delete
          if (fs.existsSync(oldAudioPath)) {
            await deleteImage(oldAudioPath);
            // console.log(`Old audio ${oldAudio} deleted successfully`);
          } else {
            console.warn(
              `Old audio ${oldAudio} not found at path ${oldAudioPath}`
            );
          }
        } catch (err) {
          console.error(`Error deleting old audio ${oldAudio}:`, err);
          return res
            .status(500)
            .json({ message: "Failed to delete old audio" });
        }
      }
    }

    // Perform the update operation
    // Include the new image if provided
    const updatedDocument = await Model.findByIdAndUpdate(
      id,
      { ...updateData, questionImage: newImage, audio: newAudio },
      {
        new: true,
      }
    );

    if (!updatedDocument) {
      return next(new ApiError(`Not Found Document For This ID : ${id}`, 404));
    }

    res.status(200).json({ success: true, data: updatedDocument });
  });

// exports.updateOne = (Model) =>
// asyncHandler(async (req, res, next) => {
//   const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });

//   if (!document) {
//     return next(
//       new ApiError(Not Found Document For This ID : ${req.params.id}, 404)
//     );
//   }
//   res.status(200).json({ success: true, data: document });
// });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`Not Found Document For This ID : ${id}`, 404));
    }
    res.status(200).json({ success: true, data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40; // Default limit is 10
    // Calculate skip value
    const skip = (page - 1) * limit;

    // Query the database with pagination
    const data = await Model.find().skip(skip).limit(limit);

    res.status(200).json({
      results: data,
      currentPage: page,
      totalPages: Math.ceil((await Model.countDocuments()) / limit),
    });
  });
