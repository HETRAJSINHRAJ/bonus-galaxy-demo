import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { bundleId, price, name, platform, successUrl, cancelUrl } = body;

    // Get user email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail, // Stripe will send receipt to this email
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: name,
              description: 'Gutschein-Bundle von Bonus Galaxy',
            },
            unit_amount: price * 100, // Stripe verwendet Cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
      metadata: {
        userId,
        bundleId,
      },
    });

    // Return the checkout URL instead of session ID
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Die Zahlungsseite konnte nicht erstellt werden. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
