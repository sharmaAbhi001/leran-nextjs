import { z } from "zod";



export const VerifySchema = z.object({
    verifyCode: z.string().min(6,{message:"must be 6 letter"})
})