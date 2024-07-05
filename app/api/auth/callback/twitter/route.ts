import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  const cookieStore = cookies();
  const savedState = cookieStore.get('state')?.value;
  const codeVerifier = cookieStore.get('codeVerifier')?.value;

  if (state !== savedState) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  if (!codeVerifier) {
    return NextResponse.json({ error: 'Missing code verifier' }, { status: 400 });
  }

  try {
    const clientId = process.env.TWITTER_CLIENT_ID!;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: 'http://localhost:3000/api/auth/callback/twitter',
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', errorText);
      throw new Error(`Token request failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();

    // Store the token securely (this is just an example, consider more secure methods)
    cookieStore.set('token', JSON.stringify(tokenData), {
      httpOnly: true,
      secure: true,
      path: '/',
    });

    // Redirect to the home page or dashboard
    return NextResponse.redirect(new URL('/home', request.url));
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
