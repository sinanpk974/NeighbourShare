import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export default async function connection(){
  const db = await mongoose.connect(process.env.DB_URL)
  console.log('database connected');
  return db
  
}