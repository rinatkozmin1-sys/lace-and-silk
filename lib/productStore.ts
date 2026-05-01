import { promises as fs } from "fs";
import path from "path";
import { products as legacyProducts } from "@/lib/products";

export type ProductJson = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");

function normalizeProduct(input: ProductJson): ProductJson {
  return {
    id: String(input.id),
    name: String(input.name).trim(),
    price: Number(input.price),
    image: String(input.image).trim(),
    category: String(input.category).trim(),
  };
}

function toSeedProducts(): ProductJson[] {
  return legacyProducts.map((p) => ({
    id: p.id,
    name: p.name.ru,
    price: p.price,
    image: p.image,
    category: p.category,
  }));
}

export async function ensureProductsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PRODUCTS_PATH);
  } catch {
    const seeded = toSeedProducts();
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(seeded, null, 2), "utf-8");
  }
}

export async function readProductsJson(): Promise<ProductJson[]> {
  await ensureProductsFile();
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  const parsed = JSON.parse(raw) as ProductJson[];
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeProduct).filter((p) => p.name && Number.isFinite(p.price));
}

export async function writeProductsJson(products: ProductJson[]) {
  await ensureProductsFile();
  const normalized = products.map(normalizeProduct);
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(normalized, null, 2), "utf-8");
}
