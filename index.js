const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const fs = require("fs");
const path = require("path");

const multer = require("multer");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errMidlewer");
const dotenv = require("dotenv");

const authcontroller = require("./controllers/authcontroller");

// Load environment variables from config.env file
dotenv.config({ path: "./config.env" });

// requirement
const questionModel = require("./models/questionModel");
const questionValidator = require("./utils/validators/questionValidator");

const Factory = require("./controllers/handlerFactory");
const apiError = require("./utils/apiError");

const authRouter = require("./Routes/authRoutes");
const questionRoute = require("./Routes/questionRoute");

// const questionRoute = require("./Routes/questionRoute");
mongoose
  .connect(process.env.DB_URL)
  .then((con) => {
    // console.log(`Mogoose Host :${con.connection.host}`);
  })
  .catch(() => console.log(`Server is not connected to MongoDB...`));

const app = express();

app.use("/uploads", express.static("uploads"));
app.use("/audios", express.static("uploads"));

app.use(cors());

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/questions", questionRoute);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
accessLogStream.on("error", (err) => {
  console.error("Stream error:", err);
});

// app.use(morgan("dev"));
// app.use(authcontroller.protect);
// app.use(authcontroller.allowedTo("admin"));

// Routes
// app.use("/api/v1/questions", questionRoute);

// Ensure the destination directory exists

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

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new apiError("only images allowed", 400), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: multerFilter });

// app.post(
//   "/api/createQuestion",
//   upload.single("questionImage"),
//   questionValidator.createQuestionValidator,
//   Factory.createOne(questionModel)
// );

// app.put(
//   "/api/updateQuestion/:id",
//   questionValidator.updateQuestionValidator,
//   Factory.updateOne(questionModel)
// );

// app.delete(
//   "/api/deleteQuestion/:id",
//   questionValidator.deleteQuestionValidator,
//   Factory.deleteOne(questionModel)
// );
// app.get(
//   "/api/getQuestion/:id",
//   questionValidator.getQuestionValidator,
//   Factory.getOne(questionModel)
// );
// app.get("/api/getQuestions", Factory.getAll(questionModel));

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find this route ; ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route ; ${req.originalUrl}`, 400));
});

// Global Error (only dev mode)
app.use(globalError);

app.listen(3001, () => {
  console.log("server connected to port 3001");
});
