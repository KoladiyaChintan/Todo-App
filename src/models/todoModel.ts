import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  id: string;
}

interface Todo extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  reminderTime: Date;
  userId: User;
}

const TodoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "pending" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reminderTime: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<Todo>("Todo", TodoSchema);
