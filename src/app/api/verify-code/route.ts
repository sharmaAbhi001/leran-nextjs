import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function POST(request:Request) {
    await dbConnect();

    try {
      const {userName,code} = await request.json();
      
      const user = await UserModel.findOne({userName});

      if(!user){
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 500,
          }
        ); 
      }

      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date();

      if(isCodeValid&&isCodeNotExpired){
        user.isVerified = true;
        await user.save();
        return Response.json({
          success:true,
          message:"User Account verify successfully"
        },{status:200});
      } else if(!isCodeNotExpired){
        return Response.json({
          success:false,
          message:"Verification code expire please signup again"
        },{status:400});
      }else{
        return Response.json({
          success:false,
          message:"Incorrect verification code"
        },{status:400});
      }


    } catch (error) {
        console.error("Error check veriy user", error);
        return Response.json(
          {
            success: false,
            message: "Error verifying user",
          },
          {
            status: 500,
          }
        );   
    }
}