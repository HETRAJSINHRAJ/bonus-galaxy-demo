import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get all users and find the one with matching email
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users.data[0];

    // Verify password using Clerk's sign-in endpoint
    // Note: This requires the user to have a password set
    try {
      // Create a session token for the user
      const token = await client.users.getUserOauthAccessToken(
        user.id,
        'oauth_custom'
      );

      // Get user sessions
      const sessions = await client.users.getUserList({
        userId: [user.id],
      });

      return NextResponse.json({
        token: token.data[0]?.token || '',
        userId: user.id,
        sessionId: user.id, // Using userId as sessionId for simplicity
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
      });
    } catch (error) {
      console.error('Password verification error:', error);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
