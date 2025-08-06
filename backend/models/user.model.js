import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
        type: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            }
        ],
        default: []
    },
    following: {
        type: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            }
        ],
        default: []
    },

  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model("User", userSchema)

