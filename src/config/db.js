const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

// Connect immediately
connectDB();

function getDb() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

function getClient() {
    return client;
}

module.exports = { getDb, getClient };
