import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function DELETE(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);

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
            { $pull: { messages: { _id: searchParams.get('messageId') } } }
        );

        return Response.json({
            success: true,
            message: "Message deleted successfully!"
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 });
    }
}
