const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const {
  createQuestionValidator,
  getQuestionValidator,
  updateQuestionValidator,
  deleteQuestionValidator,
} = require("../utils/validators/questionValidator");
const authcontroller = require("../controllers/authcontroller");

const {
  getQuestion,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/quastionController");
const apiError = require("../utils/apiError");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/question");
//   },

//   filename: function (req, file, cb) {
//     // console.log(file.mimetype);
//     const ext = file.mimetype.split("/")[1];
//     const uniqueSuffix = Math.round(Math.random() * 1e9);
//     const fileName = `questionImage-${uniqueSuffix}-${Date.now()}.${ext}`;
//     req.body.questionImage = fileName;
//     cb(null, fileName);
//   },
// });

const uploadsDir = path.join(__dirname, "../uploads/question");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const audioUploadsDir = path.join(__dirname, "../uploads/audios");
if (!fs.existsSync(audioUploadsDir)) {
  fs.mkdirSync(audioUploadsDir, { recursive: true });
}
const multerFilter = (req, file, cb) => {
  if (file.fieldname === "questionImage") {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new apiError("Only image files are allowed for questionImage", 400),
        false
      );
    }
  } else if (file.fieldname === "audio") {
    if (file.mimetype.startsWith("audio")) {
      cb(null, true);
    } else {
      cb(new apiError("Only audio files are allowed for audio", 400), false);
    }
  } else {
    cb(new apiError("Invalid file field", 400), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, fileFilter: multerFilter });

const processImage = async (req, res, next) => {
  if (!req.files || !req.files.questionImage) return next();
  try {
    const watermarkFilePath = path.resolve(
      __dirname,
      "../uploads/waterMark.png"
    );
    fs.accessSync(watermarkFilePath, fs.constants.F_OK);

    const imageFile = req.files.questionImage[0];
    // const width = 1920;
    // const height = 600;
    const quality = 100;

    const processedImageBuffer = await sharp(imageFile.buffer)
      // .resize(width, height, { position: "center" })
      .webp({ quality })
      .toBuffer();

    const watermarkBuffer = await sharp(watermarkFilePath).toBuffer();

    const finalImageBuffer = await sharp(processedImageBuffer)
      .composite([{ input: watermarkBuffer, gravity: "southeast" }])
      .toBuffer();

    const ext = "webp";
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const fileName = `questionImage-${uniqueSuffix}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFile(filePath, finalImageBuffer, (err) => {
      if (err) {
        return next(err);
      }
      req.body.questionImage = fileName;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const processAudio = (req, res, next) => {
  if (!req.files || !req.files.audio) return next();
  try {
    const audioFile = req.files.audio[0];
    const ext = path.extname(audioFile.originalname);
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const fileName = `audio-${uniqueSuffix}-${Date.now()}${ext}`;
    const filePath = path.join(audioUploadsDir, fileName);

    fs.writeFile(filePath, audioFile.buffer, (err) => {
      if (err) {
        return next(err);
      }
      req.body.audio = fileName;
      next();
    });
  } catch (error) {
    next(error);
  }
};
// router.use(authcontroller.protect, authcontroller.allowedTo("admin"));

router
  .route("/")
  .get(getQuestions)
  .post(
    authcontroller.protect,
    authcontroller.allowedTo("admin"),
    upload.fields([
      { name: "questionImage", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
    processImage,
    processAudio,
    createQuestionValidator,
    createQuestion
  );
router
  .route("/:id")
  .get(getQuestionValidator, getQuestion)
  .put(
    authcontroller.protect,
    authcontroller.allowedTo("admin"),
    upload.fields([
      { name: "questionImage", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
    processImage,
    processAudio,
    updateQuestionValidator,
    updateQuestion
  )
  .delete(
    authcontroller.protect,
    authcontroller.allowedTo("admin"),
    deleteQuestionValidator,
    deleteQuestion
  );

module.exports = router;
