import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const PRODUCTS_STORAGE_BUCKET = "products";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function extensionFromTelegramPath(filePath: string): string {
  const raw = filePath.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.has(raw)) return "jpg";
  return raw === "jpeg" ? "jpg" : raw;
}

function mimeFromExtension(ext: string): string {
  switch (ext) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

function normalizeContentType(header: string | null, ext: string): string {
  if (header && /^image\//i.test(header.trim())) return header.trim();
  return mimeFromExtension(ext);
}

/**
 * Загружает байты картинки в Supabase Storage (бакет products).
 * Клиент создаётся через getSupabaseAdmin() → SUPABASE_SERVICE_ROLE_KEY.
 */
export async function uploadProductImageBuffer(params: {
  buffer: ArrayBuffer;
  telegramFilePath: string;
  responseContentType: string | null;
}): Promise<{ publicUrl: string | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      publicUrl: null,
      error:
        "Supabase не настроен: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const ext = extensionFromTelegramPath(params.telegramFilePath);
  const objectPath = `${Date.now()}.${ext}`;
  const contentType = normalizeContentType(params.responseContentType, ext);

  const { error: uploadError } = await supabase.storage
    .from(PRODUCTS_STORAGE_BUCKET)
    .upload(objectPath, params.buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    return { publicUrl: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(PRODUCTS_STORAGE_BUCKET).getPublicUrl(objectPath);
  const publicUrl = data?.publicUrl ?? null;
  if (!publicUrl) {
    return {
      publicUrl: null,
      error: "Не удалось получить публичный URL файла в Storage.",
    };
  }

  return { publicUrl, error: null };
}
