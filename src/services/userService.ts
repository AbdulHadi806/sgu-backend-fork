import User from "../models/userModel";
import stripe from "../config/stripe";

import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
export const findUserByRegistration = async (registrationID: string) => {
  return await User.findOne({ registrationID });
};
export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const getAllUsers = async () => {
  return await User.find();
};

export const createUser = async (userData: any) => {
  const { email, password, registrationID, ...rest } = userData;

  // Basic validation
  if (!email || !password || !registrationID) {
    throw new Error("Email, password, and registrationID are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  const registrationIDRegex = /^A0/i;
  if (!registrationIDRegex.test(registrationID)) {
    throw new Error("registrationID must start with 'A0'.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already in use.");
  }

  const existingRegistrationID = await User.findOne({ registrationID });
  if (existingRegistrationID) {
    throw new Error("registrationID is already in use.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  try {
    // ✅ Step 1: Create Stripe Connect Account
    const stripeAccount = await stripe.accounts.create({
      type: "express",
      email: email,
    });

    // ✅ Step 2: Create user with Stripe Account ID
    const user = new User({
      ...rest,
      email,
      password,
      registrationID,
      stripeAccountId: stripeAccount.id,
    });

    await user.save();

    return user;
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const getUserService = async (userId: string) => {
  return await User.findById(userId);
};

export const updateUserService = async (userId: string, userData: any) => {
  return await User.findByIdAndUpdate(userId, userData, { new: true });
};

export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;
  await User.findByIdAndDelete(userId);
  return true;
};

export const updateProfilePictureService = async (
  userId: string,
  imageUrl: string
) => {
  return await User.findByIdAndUpdate(
    userId,
    { profileImage: imageUrl },
    { new: true }
  );
};
