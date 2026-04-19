import mongoose from "mongoose";

const generationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: String,
      required: true,
    },

    audience: {
      type: String,
      required: true,
    },

    tone: {
      type: String,
      default: "professional",
    },

    model: {
      type: String, // Gemini or Groq
      required: true,
    },

    ads: {
      type: Object, // store full AI response
      required: true,
    },
  },
  { timestamps: true }
);

export const Generation = mongoose.model("Generation", generationSchema);