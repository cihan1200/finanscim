import mongoose from "mongoose";

const surveyQuestionSchema = new mongoose.Schema({
  question: { type: String },
  options: [
    {
      label: String,
      value: Number,
    },
  ],
});

export default mongoose.model("SurveyQuesiton", surveyQuestionSchema);
