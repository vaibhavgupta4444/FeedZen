import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function POST(request: Request) {

    await dbConnect();

    try {
       
        const {email,code} = await request.json()

        const decodedEmail = decodeURIComponent(email);
     
        const user = await UserModel.findOne({email: decodedEmail}) 

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired please sigup again to get a new code"
            }, { status: 400 })
        }

        return Response.json({
                success: false,
                message: "Incorrect Verification code"
            }, { status: 400 })

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}