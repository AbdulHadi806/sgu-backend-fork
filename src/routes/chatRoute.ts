import express from "express";
import {
  createChat,
  getAllChats,
  addMessageToChat,
  getAllUserChats,
} from "../controllers/chatController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getAllChats);
router.get("/user", authenticateToken, getAllUserChats as any);
router.post("/create", authenticateToken, createChat);
router.put("update/:id", authenticateToken, addMessageToChat);

export default router;
