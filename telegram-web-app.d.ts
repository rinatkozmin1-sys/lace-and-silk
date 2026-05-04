export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
        /** Строка контекста пользователя внутри Telegram Mini App (часто непустая при запуске из чата). */
        initData?: string;
        addToHomeScreen?: () => void;
      };
    };
  }
}
