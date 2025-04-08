import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username?: string;
  name?: string;
  email: string;
  registrationID: string;
  password: string;
  status: "active" | "inactive" | "suspended";
  dateOfBirth?: Date;
  role: "admin" | "moderator" | "user";
  isEmailVerified: boolean;
  loginAttempts: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  bio?: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  socialLinks?: string[];
  phoneNumber?: string;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  stripeRequirementsDue?: string[];
  hasBankAccount?: boolean;
  identityVerified?: boolean;
  stripeConnected?: boolean;
  deauthorizedAt?: Date;
  lastStripeUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    // firstName: { type: String, required: true, trim: true },
    // lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    registrationID: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    dateOfBirth: { type: Date },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    isEmailVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    bio: { type: String, maxlength: 250 },
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: { type: Boolean, default: true },
    },
    socialLinks: [{ type: String }],
    phoneNumber: { type: String },
    profileImage: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
    stripeAccountId: { type: String },
    stripeOnboardingComplete: { type: Boolean, default: false },
    stripeRequirementsDue: [{ type: String }],
    hasBankAccount: { type: Boolean, default: false },
    identityVerified: { type: Boolean, default: false },
    stripeConnected: { type: Boolean, default: false },
    deauthorizedAt: { type: Date },
    lastStripeUpdate: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt); // Cast to string
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
