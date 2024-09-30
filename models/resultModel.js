const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new Schema(
  {
    userName: { type: String },
    result: { type: Array, default: [] },
    attempts: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    achived: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
