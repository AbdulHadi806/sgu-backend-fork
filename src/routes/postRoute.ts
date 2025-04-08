import express from "express";
import * as postController from "../controllers/postController";
import { upload } from "../config/multerConfig";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/premium", authenticateToken, postController.getPremiumPosts);
router.get("/", postController.getPosts);
router.get("/:userId", authenticateToken, postController.getUserPosts);
router.get("/:postId", authenticateToken, postController.getPostById);
router.post(
  "/create",
  authenticateToken,
  upload.array("images", 5),
  postController.createPost
);
router.put(
  "/:postId",
  authenticateToken,
  upload.array("images", 5),
  postController.updatePost
);
router.put(
  "/:postId/boost",
  authenticateToken,
  postController.updatePremiumPost
);
router.delete("/:postId", authenticateToken, postController.deletePost);

export default router;
