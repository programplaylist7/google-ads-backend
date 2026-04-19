// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // user must provide name
    },

    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
    },

    password: {
      type: String,
      required: true, // hashed password will be stored
    },

    quota: {
      type: Number,
      default: 5, // free user gets 5 AI generations
    },

    generations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Generation",
      },
    ],
  },
  { timestamps: true },
); // adds createdAt, updatedAt

export const User = mongoose.model("User", userSchema);
