import { OAuth2User } from 'twitter-api-sdk/dist/OAuth2User';
import { Client } from 'twitter-api-sdk';

export const oauth2Client = new OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID!,
  client_secret: process.env.TWITTER_CLIENT_SECRET!,
  callback: 'http://localhost:3000/api/auth/callback/twitter',
  scopes: ['tweet.read', 'users.read', 'offline.access'],
});

export const client = new Client(oauth2Client);
