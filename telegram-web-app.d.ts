export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
      };
    };
  }
}
