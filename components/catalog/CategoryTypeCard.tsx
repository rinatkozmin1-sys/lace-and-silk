"use client";

import Image from "next/image";

export function CategoryTypeCard({
  title,
  imageSrc,
  onSelect,
}: {
  title: string;
  imageSrc: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full flex-col text-left"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-primary/10 bg-cream/40 shadow-sm ring-1 ring-black/5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={100}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-primary/40">—</div>
        )}
      </div>
      <h3 className="mt-4 font-product text-xl font-medium text-primary leading-tight group-hover:opacity-80 md:text-2xl">
        {title}
      </h3>
    </button>
  );
}
