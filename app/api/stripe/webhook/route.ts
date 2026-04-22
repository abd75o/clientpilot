import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const status = subscription.status
        const plan = subscription.metadata.plan as 'monthly' | 'yearly'

        const stripeStatus = status === 'active' ? 'active'
          : status === 'trialing' ? 'trialing'
          : status === 'canceled' ? 'canceled'
          : 'inactive'

        await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: stripeStatus,
            subscription_plan: plan ?? null,
          } as never)
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          } as never)
          .eq('stripe_customer_id', customerId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Erreur traitement webhook' }, { status: 500 })
  }
}
