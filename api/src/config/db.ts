import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("DATABASE CONNECTED");
    }
    catch(e){
        console.error("Mongodb connection error",e)
        process.exit(1);
    }
};
export default connectDB;