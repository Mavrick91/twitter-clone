'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { Client } from 'twitter-api-sdk';
import { generateCodeChallenge, generateCodeVerifier } from '@/lib/pkce';
import { TwitterUserData } from '@/types/user';

export async function initiateTwitterAuth() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', process.env.TWITTER_CLIENT_ID!);
  authUrl.searchParams.append('redirect_uri', 'http://localhost:3000/api/auth/callback/twitter');
  authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  cookies().set('codeVerifier', codeVerifier, { httpOnly: true, secure: true, path: '/' });
  cookies().set('state', state, { httpOnly: true, secure: true, path: '/' });

  redirect(authUrl.toString());
}

export async function getUserData(): Promise<TwitterUserData | null> {
  const tokenData = cookies().get('token')?.value;

  if (!tokenData) {
    console.log('No token found in cookies');
    return null;
  }

  try {
    const { access_token } = JSON.parse(tokenData);

    const client = new Client(access_token);

    const userResponse = await client.users.findMyUser({
      'user.fields': [
        'created_at',
        'description',
        'entities',
        'id',
        'location',
        'name',
        'pinned_tweet_id',
        'profile_image_url',
        'protected',
        'public_metrics',
        'url',
        'username',
        'verified',
        'withheld',
      ],
    });

    return userResponse.data;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  cookies().delete('token');
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get('token')?.value;
  return !!token;
}
