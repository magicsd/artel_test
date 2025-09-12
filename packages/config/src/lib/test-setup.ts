import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock window.matchMedia (used by some UI libs and ThemeProvider)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
(global as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Basic mock for react-i18next so components using useTranslation don't crash in tests
vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<any>("react-i18next");
  return {
    ...actual,
    // Simple t function returns key or interpolated string
    useTranslation: () => ({
      t: (key: string, options?: Record<string, any>) => {
        if (!options) return key;
        return key.replace(/{{(.*?)}}/g, (_, k) =>
          String(options[k.trim()] ?? ""),
        );
      },
      i18n: { language: "en", changeLanguage: vi.fn() },
    }),
    Trans: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    I18nextProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    initReactI18next: { type: "3rdParty", init: vi.fn() },
  };
});
