import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";



export async function POST(request:Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);
   const user:User =  session?.user as User

   if(!session || !session.user){
    return Response.json({
      success:false,
      message:"Not Authenticated",
    },{status:500}
    )
   }

   const userId = user._id;
   const {acceptMessage} =  await request.json();

   try {
    
   const updatedUser =  await UserModel.findByIdAndUpdate(
      userId,
      {isAcceptingMessage:acceptMessage},
      {new:true}
    );

    if(!updatedUser){
      return Response.json({
        success:false,
        message:"Faild to update user status to accept message",
      },{status:401}
      )
    };

    return Response.json({
      success:true,
      message:"Message aceeptance status successfully",
      updatedUser
    },{status:200})

   } catch (error) {
    console.log(error)
    return Response.json({
      success:false,
      message:"Faild to update user status to accept message",
    },{status:500}
    )
   }

   
    
}

export async function GET(request:Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user:User = session?.user as User

  if(!session || !session.user){
    return Response.json({
      success:false,
      message:"User is not authenticated",
    },{status:500});
  }

  const userId = user._id;

 

try {
  const foundUser = await UserModel.findById(userId);

 if(foundUser){
  return Response.json({
    success:false,
    message:"User not found",
  },{status:500});
 }

 return Response.json({
  success:true,
  message:"User",
  foundUser
},{status:200});
  
} catch (error) {
  console.log(error)
  return Response.json({
    success:false,
    message:"Faild to update user status to accept message",
  },{status:500}
  )

}



}