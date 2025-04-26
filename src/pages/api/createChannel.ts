import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';
import Pusher from 'pusher';
import { v4 as uuidv4 } from 'uuid';

const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const mongoUrl = process.env.MONGODB_URI as string;
const soketiHost = process.env.SOKETI_HOST;

if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster || !mongoUrl) {
  throw new Error('Missing environment variables');
}

const pusher = new Pusher({
  appId: pusherAppId,
  key: pusherKey,
  secret: pusherSecret,
  host: soketiHost,
  useTLS: false,
  cluster: pusherCluster,
  timeout: 1000,
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { channelName } = req.body;

    if (!channelName || typeof channelName !== 'string') {
      return res.status(400).json({ error: 'Invalid channel name' });
    }

    // Sanitize collection name (MongoDB rules)
    const sanitizedName = channelName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');



    const dbId= uuidv4();
    // Check if collection already exists
    const collections = await db.listCollections({ name: `${sanitizedName}-dbId-${dbId}` }).toArray();
    if (collections.length > 0) {
      return res.status(409).json({ error: 'Channel already exists' });
    }
    // Create new collection
    await db.createCollection(`${sanitizedName}-dbId-${dbId}`);
    //pusher event trigger
    await pusher.trigger('chat', 'channels', `${sanitizedName}-dbId-${dbId}`);

    return res.status(200).json({ 
      success: true, 
      channelName: sanitizedName 
    });

  } catch (error) {
    console.error('Error creating channel:', error);
    return res.status(500).json({ error: 'Failed to create channel' });
  }
}