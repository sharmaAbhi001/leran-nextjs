import { z } from "zod";


export const userNameValidation = z 
.string()
.min(2,"Username must be at least 2 character")
.max(20,"not more than 20 ")
.regex(/^[a-zA-Z0-9]+$/,"UserName not contain special Charecter")


export const SignupSchema = z.object({
    userName:userNameValidation,
    emailId:z.string().email({message:"Invalid Emailid"}),
    password:z.string().min(6,{message:"password must be greater than 6 latter"})
})