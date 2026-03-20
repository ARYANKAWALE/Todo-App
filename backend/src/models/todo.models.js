import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    category: {
      type: String,
      default: "General",
    },
    dueDate: {
      type: Date,
    },
    // subtodo: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Subtodo"
    //     }
    // ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Todo = mongoose.model("Todo", todoSchema);

export const todo = Todo;
