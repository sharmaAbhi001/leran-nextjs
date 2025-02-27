
import mongoose from "mongoose";


type ConnectionObject ={
    isConnected?:number;
};

const connection:ConnectionObject ={}


async function dbConnect():Promise<void> {

    if(connection.isConnected)
    {
        console.log("db already connected");
        return;
    }

    try {
        const db = await mongoose.connect("helloji");
        connection.isConnected = db.connections[0].readyState
        console.log("db connected")
    } catch (error) {
        console.log("connection faild",error);
        process.exit(1)
        
    }
    
}


export default dbConnect