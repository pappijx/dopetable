import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(ui, {
      wrapper: ({ children }) => <>{children}</>,
      ...options,
    }),
  };
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
export { userEvent };
