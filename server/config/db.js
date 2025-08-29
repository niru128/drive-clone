import mongoose from "mongoose";

const connectDB = async () =>{

    try{    
         console.log("Mongo URI:", process.env.MONGO_URI); //

        const res = await mongoose.connect(process.env.MONGO_URI,)
        console.log(`MongoDB connected: ${res.connection.host}`);

    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;