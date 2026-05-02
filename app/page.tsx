import { HomeContent } from "./HomeContent";
import { catalogPayloadFromDb } from "@/lib/catalogProductMapper";
import { fetchAllProductsFromDb } from "@/lib/supabaseProductsServer";

/** Данные каталога читаются на сервере из Supabase (без fetch к своему API). */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { data, error } = await fetchAllProductsFromDb();
  const catalogPayload = catalogPayloadFromDb(data, error);

  return (
    <div className="min-h-screen bg-body">
      <HomeContent catalogPayload={catalogPayload} />
    </div>
  );
}
