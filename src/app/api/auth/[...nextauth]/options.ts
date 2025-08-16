import { NextAuthOptions, User as NextAuthUser, TokenSet, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"

// Extend the default User interface to include your custom fields
interface CustomUser extends NextAuthUser {
  id: string;
}

// Extend the default Session interface to include your custom fields
interface CustomSession extends Session {
  user: {
    _id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Extend the JWT token to include custom fields
interface CustomJWT extends TokenSet {
  _id?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text", placeholder: "joeDoe@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<CustomUser | null> {
        if (!credentials) return null
        await dbConnect()

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier }
          ]
        })

        if (!user) throw new Error("No user found with this email or username")
        if (!user.isVerified) throw new Error("Please verify your account before login")

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordCorrect) throw new Error("Incorrect password")

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
        } as CustomUser
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomJWT> {
      if (user) {
        token._id = (user as CustomUser).id;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (token && token._id) {
        (session as CustomSession).user._id = token._id;
      }
      return session as CustomSession;
    }
  },
  pages: {
    signIn: "/sign-in"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}