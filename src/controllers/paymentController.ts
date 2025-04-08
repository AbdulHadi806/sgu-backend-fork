import { Request, Response } from "express";
import stripe from "../config/stripe";
import { IPost } from "../models/postModel";
import * as paymentService from "../services/paymentService";

interface ProductType extends IPost {
  quantity?: number;
}

/**
 * @swagger
 * /payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     description: Initiates a Stripe checkout session for payment processing.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                     price:
 *                       type: number
 *                       description: Price of the product in cents.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                     vendorId:
 *                       type: string
 *                       description: Stripe Vendor ID (Stripe Connect).
 *     responses:
 *       200:
 *         description: Successfully created Stripe Checkout session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe session ID.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const sessionData = await paymentService.createCheckoutSession(
      req.body.products
    );
    res.json(sessionData);
  } catch (error: any) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    await paymentService.handleStripeWebhook(req, res);
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};

export const createAccountLink = async (req: Request, res: Response) => {
  const { stripeAccountId } = req.body;

  if (!stripeAccountId) {
    return res.status(400).json({ error: "Missing stripeAccountId" });
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      return_url: "http://192.168.8.100:3000/stripe-redirect",
      refresh_url: "http://192.168.8.100:3000/stripe-refresh",
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
