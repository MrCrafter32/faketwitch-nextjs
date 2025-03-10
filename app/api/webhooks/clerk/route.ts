import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Get the ID and type
  const { id } = payload.data;
  const eventType = payload.type;
 
  if (eventType === 'user.created') {
    await db.user.create({
        data: {
            externalUserId: payload.data.id,
            username: payload.data.username,
            imageUrl: payload.data.image_url,
            stream:{
              create:{
                name: `${payload.data.username}'s stream`,
              }
            }
        }
    })
  }
  
  if (eventType === 'user.updated') {
    const currentUser = await db.user.findUnique({
      where: {
        externalUserId: payload.data.id
      }
    })

    if(!currentUser) {
      return new Response('Error occured -- user not found', { status: 404 })
    }

    await db.user.update({ 
      where: {
        id: currentUser.id
      },
      data: {
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      }
    })
  }

  if (eventType === 'user.deleted') {
    await db.user.delete({
      where: { 
        externalUserId: payload.data.id
      }
    })
  }
  
  return new Response('', { status: 200 })
}
