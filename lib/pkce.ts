import crypto from 'crypto';

export const generateCodeVerifier = () => crypto.randomBytes(32).toString('base64url');

export const generateCodeChallenge = (verifier: string) =>
  crypto.createHash('sha256').update(verifier).digest('base64url');
