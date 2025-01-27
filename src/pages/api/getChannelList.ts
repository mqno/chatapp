import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI as string;


// Cache the MongoDB connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(mongoUrl);
  const db = client.db('chatapp');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    return res.status(200).json(collectionNames);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
}
