import { connectToDatabase } from "@/lib/db";
import User from "@/modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    const user = await User.create({
      email,
      password,
    });

    if (!user) {
      return NextResponse.json({ error: "User not created" }, { status: 400 });
    }

    return NextResponse.json(
      {
        messaage: "User registered Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration Error: ", error);
    return NextResponse.json(
      {
        messaage: "Failed to register user",
      },
      { status: 400 }
    );
  }
}
