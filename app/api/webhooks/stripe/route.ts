import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { type StripeMode } from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || "0");
        const mode = session.metadata?.mode as StripeMode;

        if (userId && credits) {
          // Update user's credits in the database
          const { error } = await supabase
            .from("user_credits")
            .upsert({
              user_id: userId,
              credits: credits,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error updating user credits:", error);
            return NextResponse.json(
              { error: "Error updating user credits" },
              { status: 500 }
            );
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const credits = parseInt(subscription.metadata?.credits || "0");
        const mode = subscription.metadata?.mode as StripeMode;

        if (userId && credits) {
          // Update user's credits in the database
          const { error } = await supabase
            .from("user_credits")
            .upsert({
              user_id: userId,
              credits: credits,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error updating user credits:", error);
            return NextResponse.json(
              { error: "Error updating user credits" },
              { status: 500 }
            );
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const mode = subscription.metadata?.mode as StripeMode;

        if (userId) {
          // Set user's credits to 0 when subscription is cancelled
          const { error } = await supabase
            .from("user_credits")
            .upsert({
              user_id: userId,
              credits: 0,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error updating user credits:", error);
            return NextResponse.json(
              { error: "Error updating user credits" },
              { status: 500 }
            );
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
} 