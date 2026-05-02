import { HomeContent } from "./HomeContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="min-h-screen bg-body">
      <HomeContent />
    </div>
  );
}
