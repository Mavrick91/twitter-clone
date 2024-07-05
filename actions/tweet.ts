'use server';

import { getTwitterClient } from '@/lib/twitter';
import { TweetCreateRequest, TweetCreateResponse } from '@/types/tweet';

export async function createTweet(
  options: TweetCreateRequest
): Promise<TweetCreateResponse | null> {
  const client = getTwitterClient();

  if (!client) {
    return null;
  }

  try {
    const response = await client.tweets.createTweet(options);

    if (response.data?.id) {
      console.log('Tweet created successfully:', response.data.id);
      return response.data;
    }
    console.error('Failed to create tweet:', response);
    return null;
  } catch (error) {
    console.error('Error creating tweet:', error);
    return null;
  }
}
