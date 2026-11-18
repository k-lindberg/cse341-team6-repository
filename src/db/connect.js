import { MongoClient } from 'mongodb';
import mongoose from 'mongoose'; // <-- Import mongoose

let db;

export const connectToDb = async () => {
    try {
        // 1. Connect the Native Driver (used by trains and trips)
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db(process.env.MONGODB_DB_NAME);
        
        // 2. Connect Mongoose (used by your new Ticket Classes)
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME
        });

        console.log("Connected to MongoDB via Native Driver and Mongoose");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};