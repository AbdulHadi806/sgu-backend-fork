import mongoose, { Schema, Types } from "mongoose";
import { IChat } from "../types";

const ChatSchema: Schema = new mongoose.Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
