import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import { IUser } from "../models/userModel";
import { IMessage } from "../types";

// Service to create a new chat
export const createChatService = async (participants: string[]) => {
  return await Chat.create({ participants, messages: [] });
};

export const addMessageToChatService = async (
  chatId: string,
  participant_id: string,
  message: string
) => {
  const newMessage = await Message.create({ participant_id, message });
  return await Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: newMessage._id } },
    { new: true }
  ).populate("messages");
};

// Service to get all chats
export const getAllChatsService = async () => {
  return await Chat.find().populate("messages");
};

export const getAllUserChatsService = async (userId: string) => {
  const chats = await Chat.find({ participants: userId })
    .populate<{ participants: IUser[] }>({
      // <-- Explicitly type populate
      path: "participants",
      select: "_id name profileImage",
    })
    .populate<{ messages: IMessage[] }>({
      path: "messages",
      options: { sort: { timestamp: -1 }, limit: 1 },
    })
    .lean();

  const formattedChats = chats.map((chat) => {
    // Safely find the other participant (exclude current user)
    const otherParticipant = chat.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    // Last message (if exists)
    const lastMessage = chat.messages?.[0] || null;

    return {
      chatId: chat._id,
      otherParticipant: otherParticipant
        ? {
            _id: otherParticipant._id,
            name: otherParticipant.name,
            profileImage: otherParticipant.profileImage,
          }
        : null, // Handle case where participant isn't found
      lastMessage,
      updatedAt: chat.updatedAt,
    };
  });

  return formattedChats;
};
