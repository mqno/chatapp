import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';
import Pusher from 'pusher';

const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const mongoUrl = process.env.MONGODB_URI as string;

if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster || !mongoUrl) {
  throw new Error('Missing environment variables');
}

const pusher = new Pusher({
  appId: pusherAppId,
  key: pusherKey,
  secret: pusherSecret,
  cluster: pusherCluster,
  useTLS: true,
});

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

    if (req.method === 'POST') {
      const { message, user } = req.body;
      
      const newMessage = {
        message,
        user,
        timestamp: new Date(),
      };
      
      await db.collection('messages').insertOne(newMessage);
      await pusher.trigger('chat', 'message', newMessage);
      
      return res.status(200).json({ success: true });
    } else if (req.method === 'GET') {
      const messages = await db
        .collection('messages')
        .find()  
        .limit(50)
        .toArray();
      
      return res.status(200).json(messages);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
