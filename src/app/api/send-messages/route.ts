import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { Message } from "@/models/User"

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "Form is currently closed"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
                success: true,
                message: "Feedback send successfully"
            }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}
