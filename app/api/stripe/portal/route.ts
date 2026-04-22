import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    const profileData = profile as unknown as { stripe_customer_id: string | null } | null

    if (!profileData?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profileData.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/parametres`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe portal error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
