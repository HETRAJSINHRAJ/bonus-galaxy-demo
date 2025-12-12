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

    const client = await clerkClient();
    
    // Clerk Frontend API URL - extracted from publishable key
    const clerkFrontendUrl = 'https://wealthy-werewolf-56.clerk.accounts.dev/v1';

    // Step 1: Create sign-in attempt via Clerk Frontend API
    const signInResponse = await fetch(`${clerkFrontendUrl}/client/sign_ins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
      }),
    });

    if (!signInResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const signInData = await signInResponse.json();
    const signInId = signInData.response?.id;

    if (!signInId) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 2: Attempt password verification
    const attemptResponse = await fetch(
      `${clerkFrontendUrl}/client/sign_ins/${signInId}/attempt_first_factor`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy: 'password',
          password: password,
        }),
      }
    );

    if (!attemptResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const attemptData = await attemptResponse.json();
    const userId = attemptData.response?.user_id;
    const sessionId = attemptData.response?.created_session_id;

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Step 3: Get user details from Backend API
    const user = await client.users.getUser(userId);

    // Step 4: Create a sign-in token for the mobile app
    const signInToken = await client.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 2592000, // 30 days
    });

    return NextResponse.json({
      token: signInToken.token,
      userId: user.id,
      sessionId: sessionId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
