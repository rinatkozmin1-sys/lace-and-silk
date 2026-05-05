"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Container } from "./Container";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { useI18n, type Lang } from "@/lib/i18n";

export function Header() {
  const { totalCount, openCart } = useCart();
  const { lang, setLang, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const applySearchToUrl = (nextSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = nextSearch.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const langOptions: { value: Lang; label: string }[] = [
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
    { value: "de", label: "DE" },
    { value: "kk", label: "KZ" },
    { value: "uk", label: "UK" },
    { value: "uz", label: "UZ" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-body/95 backdrop-blur supports-[backdrop-filter]:bg-body/80">
      <Container>
        <div className="py-2 md:flex md:h-16 md:items-center md:justify-between md:py-0">
          <div className="flex justify-center md:justify-start">
            <Link
              href="/"
              scroll={false}
              className="truncate text-center font-serif text-2xl font-medium text-primary sm:text-3xl md:text-2xl"
            >
              Hristianskyi style
            </Link>
          </div>

          <div className="mt-2 flex shrink-0 items-center justify-center gap-1 md:mt-0 md:justify-end">
            <label className="sr-only" htmlFor="lang-select">
              {t("header.language")}
            </label>
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-8 rounded-full bg-transparent px-2.5 text-xs font-medium tracking-wide text-primary/80 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary/15 sm:h-9 sm:px-3"
            >
              {langOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={openCart}
              aria-label={t("header.cart")}
              className="relative inline-flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalCount > 0 && (
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-white",
                    totalCount > 99 && "min-w-4 px-0.5"
                  )}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <CurrencySwitcher />
            <div className="flex items-center">
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-out",
                  isSearchOpen
                    ? "mr-1 max-w-[190px] opacity-100 sm:max-w-[250px]"
                    : "mr-0 max-w-0 opacity-0"
                )}
              >
                <div className="flex items-center rounded-full border border-primary/15 bg-white/70 pl-3 pr-1.5">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        applySearchToUrl(searchValue);
                      }
                    }}
                    placeholder={t("header.searchPlaceholder")}
                    className="h-9 w-[135px] bg-transparent text-sm text-primary placeholder:text-primary/45 focus:outline-none sm:w-[190px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue("");
                      applySearchToUrl("");
                      setIsSearchOpen(false);
                    }}
                    aria-label={t("header.clearSearch")}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary/60 transition-colors hover:bg-stone-100 hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <IconButton
                aria-label={t("header.search")}
                onClick={() => {
                  if (isSearchOpen) {
                    applySearchToUrl(searchValue);
                    return;
                  }
                  setIsSearchOpen(true);
                }}
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </IconButton>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
