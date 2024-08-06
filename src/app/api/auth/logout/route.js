import { NextResponse } from "next/server";
import User from "../../../../schemas/User";
import connectToDatabase from "../../../../_database/mongodb";

export async function GET(request) {
  try {
    const loggedUserId = request.headers.get("x-user-id");
    await connectToDatabase();
    await User.findOneAndUpdate(
      { _id: loggedUserId },
      { $set: { lastLoginAt: Date.now() } }
    );

    const response = NextResponse.json({
      message: "Logout successfull",
    });

    // Remove the token from cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.log("Something went wrong!", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
