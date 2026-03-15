import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
    if (cached.conn) {
        console.log("Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: DB_NAME
        };

        const MONGODB_URL = process.env.MONGO_URI || process.env.MONGO_URL;

        cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`\n MongoDB connected !! DB HOST: ${cached.conn.connection.host}`);
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export { dbConnect };