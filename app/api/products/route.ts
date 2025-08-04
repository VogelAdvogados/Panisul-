import { NextResponse } from 'next/server';

let products: any[] = [];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const newProduct = await request.json();
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
