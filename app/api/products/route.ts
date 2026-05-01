import { NextResponse } from "next/server";
import { fetchAllProductsFromDb } from "@/lib/supabaseProductsServer";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: products, error } = await fetchAllProductsFromDb();
  if (error) {
    return NextResponse.json({ error, products: [] }, { status: 503 });
  }
  return NextResponse.json({ products });
}
