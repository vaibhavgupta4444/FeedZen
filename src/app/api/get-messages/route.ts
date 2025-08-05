import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

  

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })

    }

    
    try {
        const userData = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
            { $project: { 
                messages: {
                    $sortArray: {
                        input: "$messages",
                        sortBy: { createdAt: -1 }
                    }
                } 
            }}
        ]);



        if (!userData || userData.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })

        }

        return Response.json({
            success: true,
            messages: userData[0].messages
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error getting message"
        }, {
            status: 500
        })
    }
}