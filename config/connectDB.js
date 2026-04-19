import mongoose from "mongoose";
import dns from "dns";

// ✅ Force Node to resolve DNS in IPv4 order (fix SRV bug)
// dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1"]);
let isConnected = false; 
export const connectDB = async () => {
    if (isConnected) return; 
    try{
        const db = await mongoose.connect(process.env.MONGO_URL);
        isConnected = true; 
        console.log("db connected successFully");

    } catch(error){
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
}