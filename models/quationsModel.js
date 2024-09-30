const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new Schema(
  {
    userName: { type: String },
    quations: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
