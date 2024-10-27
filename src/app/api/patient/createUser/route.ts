import { NextResponse } from "next/server";
import { UserModel } from "@/models/userModel";
import dbconnect from "@/connectDb";

export async function POST(req: Request) {
  await dbconnect();

  try {
    const { name, email, phone } = await req.json();

    // Validate input
    if (!name || !email || !phone) {
      return NextResponse.json({ message: "All input fields are required." }, { status: 400 });
    }

    // Check if the user with the given email already exists
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // Create new user
    const user = await UserModel.create({ name, email, phone });

    return NextResponse.json({ message: "User created successfully.", data: user }, { status: 201 });
  } catch (error) {
    console.error("Error while creating user:", error);
    return NextResponse.json({ message: "Error while creating user. Please try again later." }, { status: 500 });
  }
}
