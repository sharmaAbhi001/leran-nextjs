import {z} from "zod";
import { userNameValidation } from "./SignupSchema";



export const SignInSchema = z.object({
    userName:userNameValidation,
    password:z.string().min(6,{message:"password must be greater than 6 latter"})
})

