import { NextResponse } from 'next/server';

let clients: any[] = [];

export async function GET() {
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const newClient = await request.json();
  clients.push(newClient);
  return NextResponse.json(newClient, { status: 201 });
}
