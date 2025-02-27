import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";



export async function SendVerificationEmail(
    emailId:string,
    userName:string,
    verifyCode:string,
) :Promise<ApiResponse> {
    
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:emailId,
            subject:"Feedback do | verification code",
            react:VerificationEmail({userName,otp:verifyCode})

        });

        return{
            success:true,
            message:" Verification code send Successfully ",
        }
    } catch (EmailError) {
        console.log("Error sending verification email:",EmailError);
        return{
            success:false,
            message:"Faild to send verification code",
        }
    }

}
