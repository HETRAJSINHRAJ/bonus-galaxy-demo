import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user using Clerk's Backend API
    const client = await clerkClient();
    
    try {
      const user = await client.users.createUser({
        emailAddress: [email],
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      // Create a session token for the new user
      const token = await client.signInTokens.createSignInToken({
        userId: user.id,
        expiresInSeconds: 2592000, // 30 days
      });

      return NextResponse.json({
        token: token.token,
        userId: user.id,
        sessionId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
      }, { status: 201 });
    } catch (error: any) {
      console.error('User creation error:', error);
      
      // Handle specific Clerk errors
      if (error.errors) {
        const clerkError = error.errors[0];
        if (clerkError.code === 'form_identifier_exists') {
          return NextResponse.json(
            { error: 'An account with this email already exists' },
            { status: 400 }
          );
        }
        if (clerkError.code === 'form_password_pwned') {
          return NextResponse.json(
            { error: 'This password has been compromised. Please choose a different one.' },
            { status: 400 }
          );
        }
        if (clerkError.code === 'form_password_length_too_short') {
          return NextResponse.json(
            { error: 'Password must be at least 8 characters long' },
            { status: 400 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
