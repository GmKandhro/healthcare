import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export  async function POST(req: Request) {
  const { to, body } = await req.json();

  try {
    const message = await client.messages.create({
      body, // Message text
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      to, // Receiver's number
    });

    return NextResponse.json({message}, { status: 200 });
} catch (error:any) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({error}, { status: 500 });
  }
}
