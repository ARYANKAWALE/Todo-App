import mongoose from "mongoose"
const todoSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
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
        required: true
    }

}, { timestamps: true })

const Todo = mongoose.model("Todo", todoSchema)

export const todo = Todo
