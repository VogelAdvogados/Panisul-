import { NextResponse } from 'next/server';

let sales: any[] = [];

export async function GET() {
  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  const newSale = await request.json();
  sales.push(newSale);
  return NextResponse.json(newSale, { status: 201 });
}
