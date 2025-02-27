import {z} from "zod"


export const MessageSchema = z.object({

    content:z
    .string()
    .min(10,{message:"Message atleast 10 charecter"})
    .max(300,{message:"Not more than 300 charecter"}),

    createdAt:z.date(),
})