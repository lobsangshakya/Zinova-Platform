/**
 * Preservation Property Tests
 *
 * Task 2 — These tests encode BASELINE behavior that must be preserved.
 * They are written BEFORE the fix and MUST PASS on the current code.
 * After the fix is applied (Task 3), they must continue to pass (no regressions).
 *
 * Validates: Requirements 3.3, 3.4, 3.7
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as fc from "fast-check";
import React from "react";

// ---------------------------------------------------------------------------
// PBT 1 — Theme Toggle Preservation
//
// Property: For all sequences of toggleTheme() calls, the DOM class always
// matches the final theme state and localStorage.theme is updated.
//
// Validates: Requirements 3.4
// ---------------------------------------------------------------------------
describe("PBT 1 — Theme Toggle Preservation", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it(
    "for all toggle sequences: DOM class matches final theme and localStorage is updated",
    /**
     * **Validates: Requirements 3.4**
     *
     * Property: For any sequence of N toggleTheme() calls (N ∈ [0..20]),
     * the final theme is deterministic (light if N is even, dark if N is odd
     * starting from light), the DOM class matches, and localStorage.theme
     * holds the correct value.
     *
     * This confirms that theme toggling is preserved across arbitrary
     * interaction sequences — a core preservation requirement.
     */
    async () => {
      const { ThemeProvider, useTheme } = await import(
        "../components/ThemeProvider"
      );

      await fc.assert(
        fc.asyncProperty(
          // Generate a sequence of toggle counts between 0 and 20
          fc.integer({ min: 0, max: 20 }),
          async (toggleCount) => {
            // Reset state between runs
            localStorage.clear();
            document.documentElement.classList.remove("dark");

            // A helper component that exposes toggleTheme via a button
            let capturedToggle: (() => void) | null = null;

            function ToggleCapture() {
              const { toggleTheme } = useTheme();
              capturedToggle = toggleTheme;
              return null;
            }

            await act(async () => {
              render(
                React.createElement(
                  ThemeProvider,
                  null,
                  React.createElement(ToggleCapture)
                )
              );
              // Let mount effects settle
              await new Promise((r) => setTimeout(r, 50));
            });

            // Perform the toggle sequence
            for (let i = 0; i < toggleCount; i++) {
              await act(async () => {
                capturedToggle!();
                await new Promise((r) => setTimeout(r, 10));
              });
            }

            // Determine expected final theme:
            // starts at "light", each toggle flips it
            const expectedTheme = toggleCount % 2 === 0 ? "light" : "dark";

            // Assert DOM class matches expected theme
            if (expectedTheme === "dark") {
              expect(
                document.documentElement.classList.contains("dark"),
                `After ${toggleCount} toggles, expected 'dark' class on documentElement`
              ).toBe(true);
            } else {
              expect(
                document.documentElement.classList.contains("dark"),
                `After ${toggleCount} toggles, expected NO 'dark' class on documentElement`
              ).toBe(false);
            }

            // Assert localStorage.theme is updated (only set after at least one toggle)
            if (toggleCount > 0) {
              expect(
                localStorage.getItem("theme"),
                `After ${toggleCount} toggles, localStorage.theme should be '${expectedTheme}'`
              ).toBe(expectedTheme);
            }
          }
        ),
        { numRuns: 30 }
      );
    }
  );
});

// ---------------------------------------------------------------------------
// PBT 2 — Dashboard Auth Redirect Preservation
//
// Property: For all auth token states (present / absent), Dashboard redirects
// when token is absent and renders when present.
//
// Strategy: Render Dashboard inside a full MemoryRouter with Routes so that
// react-router-dom's navigate() actually changes the in-memory location.
// We then inspect the rendered output to determine whether a redirect occurred.
//
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

/**
 * Helper: render Dashboard inside a MemoryRouter with a /login route stub.
 * Returns the container so we can inspect what was rendered.
 */
async function renderDashboardWithRouter() {
  const Dashboard = (await import("../pages/Dashboard")).default;
  const { Routes, Route } = await import("react-router-dom");

  function LoginStub() {
    return React.createElement("div", { "data-testid": "login-page" }, "Login");
  }

  function DashboardWrapper() {
    return React.createElement(
      MemoryRouter,
      { initialEntries: ["/dashboard"] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/dashboard", element: React.createElement(Dashboard) }),
        React.createElement(Route, { path: "/login", element: React.createElement(LoginStub) })
      )
    );
  }

  let container!: HTMLElement;
  await act(async () => {
    const result = render(React.createElement(DashboardWrapper));
    container = result.container;
    await new Promise((r) => setTimeout(r, 80));
  });

  return container;
}

describe("PBT 2 — Dashboard Auth Redirect Preservation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it(
    "for all token-absent states: Dashboard redirects to /login",
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any state where authToken is absent (null or not set),
     * Dashboard must redirect to /login (the login stub is rendered instead).
     *
     * This confirms the auth redirect is preserved — a core preservation
     * requirement that must not regress after the fix.
     */
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate absent-token states: null (not set at all)
          fc.constant(null),
          async (_tokenValue) => {
            localStorage.clear();
            // token not set — absent

            const container = await renderDashboardWithRouter();

            // When token is absent, Dashboard redirects → login stub is shown
            const loginPage = container.querySelector("[data-testid='login-page']");
            expect(
              loginPage,
              "With no auth token, Dashboard should redirect to /login (login stub should be visible)"
            ).not.toBeNull();
          }
        ),
        { numRuns: 5 }
      );
    }
  );

  it(
    "for all token-present states: Dashboard renders without redirect",
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any non-empty authToken value, Dashboard renders its
     * content (the "Welcome!" heading) without redirecting to /login.
     *
     * This confirms that authenticated users continue to see the Dashboard
     * after the fix is applied.
     */
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate valid (non-empty, non-whitespace) token strings
          fc.string({ minLength: 1, maxLength: 64 }).filter((s) => s.trim().length > 0),
          async (token) => {
            localStorage.clear();
            localStorage.setItem("authToken", token);

            const container = await renderDashboardWithRouter();

            // With a valid token, Dashboard renders its own content — not the login stub
            const loginPage = container.querySelector("[data-testid='login-page']");
            expect(
              loginPage,
              `With token '${token}', Dashboard should NOT redirect to /login`
            ).toBeNull();

            // The Dashboard's welcome heading should be present
            const welcomeHeading = container.querySelector("h1");
            expect(
              welcomeHeading,
              "Dashboard should render its Welcome heading when token is present"
            ).not.toBeNull();
          }
        ),
        { numRuns: 30 }
      );
    }
  );
});
