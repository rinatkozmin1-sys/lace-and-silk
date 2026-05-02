import { NextResponse } from "next/server";
import { fetchAllProducts } from "@/lib/supabaseProductsServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function GET() {
  const { data: products, error } = await fetchAllProducts();
  if (error) {
    return NextResponse.json(
      { error, products: [] },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
  return NextResponse.json({ products }, { headers: NO_STORE_HEADERS });
}
