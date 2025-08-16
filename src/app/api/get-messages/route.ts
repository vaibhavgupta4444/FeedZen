import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!session || !user?._id) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 })
  }

  try {
    const userData = await UserModel.findById(user._id)

    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Sort messages descending by createdAt
    const messages = userData.messages
      ? [...userData.messages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      : []

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error getting messages" }, { status: 500 })
  }
}