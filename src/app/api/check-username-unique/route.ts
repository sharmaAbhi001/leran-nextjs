import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/SignupSchema";


const UsernameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParm = {
      userName: searchParams.get("userName"),
    };

    

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParm);

    if (!result.success) {
      const userNameError = result.error?.format().userName?._errors || [];

      return Response.json({
        success: false,
        message:
          userNameError?.length > 0
            ? userNameError.join(",")
            : "Invalid username ",
      });
    }

    const { userName } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      userName,
      isVerified:true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error check", error);
    return Response.json(
      {
        success: false,
        message: "Error checking error",
      },
      {
        status: 500,
      }
    );
  }
}
