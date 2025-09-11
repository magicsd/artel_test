import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";

// Простой провайдер для тестов без i18n зависимости
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
