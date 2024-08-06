import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../../../schemas/User";
import { generateRandomUsername } from "../../../../helpers/Backend";
import connectToDatabase from "../../../../_database/mongodb";

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phoneNumber } = await request.json();;
    await connectToDatabase();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const isAlreadyExist = await User.findOne({ email });
    if (isAlreadyExist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    let userName = generateRandomUsername(firstName, lastName);

    while (await User.findOne({ userName })) {
      userName = generateRandomUsername(firstName, lastName);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while registering user:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
