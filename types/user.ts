import { Client } from 'twitter-api-sdk';

type FindMyUserResponse = Awaited<ReturnType<Client['users']['findMyUser']>>;
export type TwitterUserData = FindMyUserResponse['data'];
