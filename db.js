import {MongoClient} from "mongodb";
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/employee_db";
const client = new MongoClient(uri);
import mongoose from "mongoose";


export const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export const getDb = () => {
  return client.db();
}

