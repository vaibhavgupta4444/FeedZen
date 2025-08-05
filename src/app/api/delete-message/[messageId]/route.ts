import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { messageId: string } }) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    try {
        await UserModel.updateOne(
            { _id: session.user._id },
            { $pull: { messages: { _id: params.messageId } } }
        );

        return Response.json({
            success: true,
            message: "Message deleted successfully!"
        });
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 });
    }
}
