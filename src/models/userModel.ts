import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
}

// Create the User schema
const userSchema = new Schema<IUser>({
  name: {
    type: String, // Use `String` instead of `string`
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email uniqueness if necessary
  },
  phone: {
    type: Number,
    required: true,
  },
});

// Create the User model with proper TypeScript type
export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
