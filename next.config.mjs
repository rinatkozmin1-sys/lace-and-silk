/** @type {import('next').NextConfig} */
function supabaseStorageRemotePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    return {
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "api.telegram.org",
    pathname: "/**",
  },
];

const supabasePattern = supabaseStorageRemotePattern();
if (supabasePattern) remotePatterns.push(supabasePattern);

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
