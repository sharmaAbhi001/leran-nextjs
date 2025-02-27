import mongoose, {Schema,Document} from "mongoose";



export interface Message extends Document {
    content:string;
    createdAt:Date;
}


const MessageSchema :Schema<Message> = new Schema({

    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    }

});



export interface User extends Document{

    userName:string;
    emailId:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];

};



const UserSchema :Schema<User> = new Schema({

    userName:{
        type:String,
        required:[true,"Enter user name"],
        unique:true,
    },
    emailId:{
        type:String,
        required:[true,"Please Enter emailId"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please enter Password"],
    },
    verifyCode:{
        type:String,
        required:[true,"please enter code"],
    },
    verifyCodeExpiry:{
       type:Date,
       required:[true,"Verified code expiry is required"],
       default:Date.now(),
    },
    isVerified:{
       type:Boolean,
       required:[true,"Verified is required"],
       default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    messages: [MessageSchema],

});



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema);


export default UserModel;

