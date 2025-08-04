import { NextResponse } from 'next/server';

let swaps: any[] = [];

export async function GET() {
  return NextResponse.json(swaps);
}

export async function POST(request: Request) {
  const newSwap = await request.json();
  swaps.push(newSwap);
  return NextResponse.json(newSwap, { status: 201 });
}
