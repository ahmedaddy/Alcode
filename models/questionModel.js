const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    id: Number,
    question: String,
    question2: String,
    questionImage: String,
    audio: String,
    questionAnswer: String,
    answer: Number,
    correction: String,
    options: [String],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  // return image base url + image name
  if (doc.questionImage) {
    const imgURL = `${process.env.BASE_URL}/uploads/question/${doc.questionImage}`;
    doc.questionImage = imgURL; // Fixed the property name from 'image' to 'questionImage'
  }
};
const setAudioURL = (doc) => {
  // return image base url + image name
  if (doc.audio) {
    const imgURL = `${process.env.BASE_URL}/uploads/audios/${doc.audio}`;
    doc.audio = imgURL; // Fixed the property name from 'image' to 'questionImage'
  }
};

// post("init") hook for findOne and findAll
questionSchema.post("find", (docs) => {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => setImageURL(doc));
    docs.forEach((docs) => setAudioURL(docs));
  } else {
    setImageURL(docs);
    setAudioURL(docs);
  }
});
questionSchema.post("findOne", (doc) => {
  setImageURL(doc);
  setAudioURL(doc);
});

// post("save") hook for create and update
questionSchema.post("save", (doc) => setImageURL(doc));
questionSchema.post("save", (doc) => setAudioURL(doc));

module.exports = mongoose.model("Question", questionSchema);
