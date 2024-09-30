const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");

const questioModel = require("../../models/questionModel");

exports.getQuestionValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.createQuestionValidator = [
  // check("questionImage").notEmpty().withMessage("Question Image Required"),
  check("answer").notEmpty().withMessage("Answer Required"),
  check("question").notEmpty().withMessage("question Required"),
  check("audio").notEmpty().withMessage("audio Required"),
  // check("icon").notEmpty().withMessage("icon Required"),
  // check("questionImage").notEmpty().withMessage("question image Required"),
  // check("questionAnswer").notEmpty().withMessage("question answer Required"),
  // .isArray()
  // .withMessage("Answer Must Be Array"),
  validatorMiddleware,
];

exports.updateQuestionValidator = [
  check("id").isMongoId().withMessage("Invalid Question ID Format"),
  validatorMiddleware,
];

exports.deleteQuestionValidator = [
  check("id").isMongoId().withMessage("Invalid Question ID Format"),
  validatorMiddleware,
];
