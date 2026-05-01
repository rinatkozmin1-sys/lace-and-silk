"use client";

import { useEffect, useState } from "react";

export function IntroScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleSkip = () => {
    if (isFadingOut) {
      return;
    }

    setIsFadingOut(true);
    window.setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, 5000);

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/65"
      >
        Пропустить
      </button>
      <video
        className="h-full w-full object-cover"
        src="/intro_.mp4"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
