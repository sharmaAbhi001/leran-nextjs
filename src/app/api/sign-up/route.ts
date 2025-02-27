import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/helper/SendVerificationCode";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, emailId, password } = await request.json();

    const existingUserVerifiedByUserName = await UserModel.findOne({
      userName,
      isVarified: true,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ emailId });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
    
        if(existingUserByEmail.isVarified)
        {
            return Response.json({
                success:false,
                message:"User already exist with this emailId",
            },{status:400})
        }else{
            const hasedPassword = await bcrypt.hash(password,10);

            existingUserByEmail.password = hasedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

            await existingUserByEmail.save();
        }


    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userName: userName,
        emailId: emailId,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVarified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send verificaiton email
    const emailResponse = await SendVerificationEmail(
      emailId,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: `Faild to send verification ${emailId} ${emailResponse.message} `,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Register successfully, Please verify your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error registering User", error);
    return Response.json(
      {
        success: false,
        message: "Faild to sign up ",
      },
      {
        status: 500,
      }
    );
  }
}
