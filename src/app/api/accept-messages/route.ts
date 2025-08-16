import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 })
  }

  const user = await UserModel.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  const { acceptMessages } = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user status" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Message acceptance status updated successfully", updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    )
  }
}

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 })
  }

  const user = await UserModel.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  try {
    return NextResponse.json({ success: true, isAcceptingMessages: user.isAcceptingMessages }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Error getting message acceptance status" },
      { status: 500 }
    )
  }
}
