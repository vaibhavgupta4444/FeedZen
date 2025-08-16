import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, email, password } = await request.json()

    // Check username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      )
    }

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedPassword = await bcrypt.hash(password, 10)
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    const existingUserByEmail = await UserModel.findOne({ email })

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        )
      } else {
        existingUserByEmail.username = username
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = expiryDate
        await existingUserByEmail.save()
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
      })
      await newUser.save()
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode)
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully, please verify your email" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    )
  }
}
