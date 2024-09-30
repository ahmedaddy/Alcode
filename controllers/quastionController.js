const questionModel = require("../models/questionModel");
const handlerFactory = require("./handlerFactory");

exports.getQuestion = handlerFactory.getOne(questionModel);

exports.getQuestions = handlerFactory.getAll(questionModel);

exports.createQuestion = handlerFactory.createOne(questionModel);

exports.updateQuestion = handlerFactory.updateOne(questionModel);

exports.deleteQuestion = handlerFactory.deleteOne(questionModel);
