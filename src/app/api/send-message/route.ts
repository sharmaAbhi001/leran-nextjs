import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request:Request) {

    await dbConnect();

  const {userName,content} = await request.json()
  
  try {
   const user = await UserModel.findOne({userName})

   if(!user){
    return Response.json({
        success:false,
        message:"User not found "
    },{status:404})
   }

   // is user accepting the messages
   if(!user.isAcceptingMessage){
    return Response.json({
        success:false,
        message:"User turn of accepting messages"
    },{status:403});
   }

   const newMessage = {content,createdAt:new Date()}

   user.messages.push(newMessage as Message)

   await user.save();

   return Response.json({
    success:true,
    message:"message sent successfully",
   },{status:401});
   

  } catch (error) {
    console.log(error);
    return Response.json({
        success:false,
        message:"something went wrong ",
    },{status:500})
  }

}