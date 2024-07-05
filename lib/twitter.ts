import { cookies } from 'next/headers';
import { Client } from 'twitter-api-sdk';

export function getTwitterClient(): Client | null {
  const tokenData = cookies().get('token')?.value;

  if (!tokenData) {
    console.error('No token found in cookies');
    return null;
  }

  try {
    const { access_token } = JSON.parse(tokenData);
    return new Client(access_token);
  } catch (error) {
    console.error('Error creating Twitter client:', error);
    return null;
  }
}
