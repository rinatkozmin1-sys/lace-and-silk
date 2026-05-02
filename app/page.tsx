import { HomeContent } from "./HomeContent";

/** Каталог подгружается с клиента из `/api/products`; страница не должна кэшироваться как статика. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="min-h-screen bg-body">
      <HomeContent />
    </div>
  );
}
