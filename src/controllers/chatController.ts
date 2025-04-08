import { Request, Response } from "express";
import {
  createChatService,
  addMessageToChatService,
  getAllChatsService,
  getAllUserChatsService,
} from "../services/chatService";
import { AuthenticatedUserRequest } from "../types";

/**
 * @swagger
 * /chat/create:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Chat created successfully
 *       500:
 *         description: Failed to create chat
 */
export const createChat = async (req: Request, res: Response) => {
  try {
    const { participants } = req.body;
    const newChat = await createChatService(participants);
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

/**
 * @swagger
 * /chat/update:
 *   post:
 *     summary: Add a message to a chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *               participant_id:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message added successfully
 *       500:
 *         description: Failed to add message to chat
 */
export const addMessageToChat = async (req: Request, res: Response) => {
  try {
    const { chatId, participant_id, message } = req.body;
    const updatedChat = await addMessageToChatService(
      chatId,
      participant_id,
      message
    );
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to add message to chat" });
  }
};

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Get all chats
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Successfully retrieved all chats
 *       500:
 *         description: Failed to fetch chats
 */
export const getAllChats = async (_req: Request, res: Response) => {
  try {
    const chats = await getAllChatsService();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getAllUserChats = async (
  _req: AuthenticatedUserRequest,
  res: Response
) => {
  if (_req?.user?.id) {
    try {
      const chats = await getAllUserChatsService(_req.user.id);
      res.status(200).json(chats);
    } catch (error) {
      console.error("Chat fetch error:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  }
};
