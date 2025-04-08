import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoute from "./authRoute";
import postRoute from "./postRoute";
import paymentRoutes from "./paymentRoutes";
import chatRoute from "./chatRoute";
const router = Router();

router.use("/login", authRoute);
router.use("/user", userRoutes);
router.use("/posts", postRoute);
router.use("/chat", chatRoute);
router.use("/payments", paymentRoutes);

export default router;
