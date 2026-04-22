import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { Client, Profile } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { type, clientId, devisId, channel } = body

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('user_id', user.id)
      .single()

    if (!client) {
      return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
    }

    const clientData = client as unknown as Client

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, business_name')
      .eq('id', user.id)
      .single()

    const profileData = profile as unknown as Pick<Profile, 'full_name' | 'business_name'> | null

    const senderName = profileData?.business_name ?? profileData?.full_name ?? 'Votre prestataire'

    if (channel === 'email' && clientData.email) {
      await sendEmail(type, clientData, senderName, profileData?.business_name)
    } else if (channel === 'sms' && clientData.phone) {
      await sendSMS(type, clientData, senderName)
    } else {
      return NextResponse.json({ error: 'Coordonnées manquantes' }, { status: 400 })
    }

    await supabase.from('relances').insert({
      user_id: user.id,
      client_id: clientId,
      devis_id: devisId ?? null,
      type,
      channel,
      status: 'sent',
      sent_at: new Date().toISOString(),
    } as never)

    if (type === 'avis') {
      await supabase.from('avis').insert({
        user_id: user.id,
        client_id: clientId,
        requested_at: new Date().toISOString(),
      } as never)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending relance:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

async function sendEmail(
  type: string,
  client: Pick<Client, 'name' | 'email'>,
  senderName: string,
  businessName?: string | null
) {
  if (!client.email) return

  const subjects: Record<string, string> = {
    devis: `Votre devis est toujours disponible — ${senderName}`,
    inactif: `On a pensé à vous — ${senderName}`,
    avis: `Votre avis nous est précieux — ${senderName}`,
  }

  const htmlContents: Record<string, string> = {
    devis: `
      <p>Bonjour ${client.name},</p>
      <p>Je me permets de revenir vers vous concernant le devis que je vous ai transmis récemment.</p>
      <p>Avez-vous eu le temps de l'examiner ? Je reste disponible pour répondre à vos questions ou ajuster la proposition si nécessaire.</p>
      <p>N'hésitez pas à me contacter directement.</p>
      <p>Cordialement,<br/><strong>${senderName}</strong></p>
    `,
    inactif: `
      <p>Bonjour ${client.name},</p>
      <p>Cela fait un moment que nous n'avons pas eu l'occasion d'échanger.</p>
      <p>Avez-vous de nouveaux besoins sur lesquels je pourrais vous aider ?</p>
      <p>Je reste à votre disposition.</p>
      <p>Cordialement,<br/><strong>${senderName}</strong></p>
    `,
    avis: `
      <p>Bonjour ${client.name},</p>
      <p>J'espère que vous êtes satisfait(e) de notre collaboration.</p>
      <p>Pourriez-vous prendre 1 minute pour nous laisser un avis Google ? Cela nous aide énormément à nous faire connaître.</p>
      <p>Merci beaucoup pour votre confiance.</p>
      <p>Cordialement,<br/><strong>${senderName}</strong></p>
    `,
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@clientpilot.fr',
    to: client.email,
    subject: subjects[type] ?? `Message de ${senderName}`,
    html: htmlContents[type] ?? '',
  })
}

async function sendSMS(
  type: string,
  client: Pick<Client, 'name' | 'phone'>,
  senderName: string
) {
  if (!client.phone) return

  const messages: Record<string, string> = {
    devis: `Bonjour ${client.name}, je me permets de revenir sur votre devis. Avez-vous des questions ? — ${senderName}`,
    inactif: `Bonjour ${client.name}, cela fait un moment. Avez-vous de nouveaux besoins ? — ${senderName}`,
    avis: `Bonjour ${client.name}, pourriez-vous nous laisser un avis Google ? Merci ! — ${senderName}`,
  }

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio')
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    await twilioClient.messages.create({
      body: messages[type] ?? `Message de ${senderName}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: client.phone,
    })
  }
}
