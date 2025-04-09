import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/authService";
import {
  findUserByEmail,
  findUserByRegistration,
} from "../services/userService";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Logs in a user using email or registration number and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrReg:
 *                 type: string
 *                 example: kami@gmail.com or REG12345
 *               password:
 *                 type: string
 *                 example: Kami2466
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request (missing fields)
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { emailOrReg, password } = req.body;

  if (!emailOrReg || !password) {
    res
      .status(400)
      .json({ message: "Email/Registration and password are required" });
    return;
  }

  try {
    // Determine if it's an email or a registration number
    const isEmail = /\S+@\S+\.\S+/.test(emailOrReg);
    const user = isEmail
      ? await findUserByEmail(emailOrReg)
      : await findUserByRegistration(emailOrReg);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id.toString(), user.role);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};
