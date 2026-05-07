/**
 * Bug Condition Exploration Tests
 *
 * Task 1 — These tests encode the EXPECTED (fixed) behavior.
 * On UNFIXED code they FAIL, confirming the bugs exist.
 * On FIXED code they PASS, confirming the bugs are resolved.
 *
 * Validates: Requirements 1.2, 1.4, 1.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { readFileSync } from "fs";
import { resolve } from "path";
import React from "react";

// ---------------------------------------------------------------------------
// Test 1 — ThemeProvider render count
// Bug Condition: useEffect.deps CONTAINS "theme" AND useEffect CALLS setTheme
// Expected: render count ≤ 2 after mount with localStorage.theme = "dark"
// ---------------------------------------------------------------------------
describe("Test 1 — ThemeProvider render count", () => {
  beforeEach(() => {
    localStorage.setItem("theme", "dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.restoreAllMocks();
  });

  it("should render ≤ 2 times when localStorage.theme is 'dark' (no infinite loop)", async () => {
    /**
     * Validates: Requirements 1.2
     *
     * Bug Condition: ThemeProvider.useEffect.deps CONTAINS "theme"
     *                AND useEffect CALLS setTheme
     *
     * On unfixed code: the effect reads savedTheme, calls setTheme("dark"),
     * which triggers a re-render, which re-runs the effect → infinite loop.
     * Render count grows unbounded → assertion fails.
     *
     * On fixed code: two separate effects — one reads localStorage ([] deps),
     * one applies DOM class ([theme] deps). Render count stays ≤ 2.
     */
    const { ThemeProvider } = await import("../components/ThemeProvider");

    let renderCount = 0;

    function Counter() {
      renderCount++;
      return null;
    }

    await act(async () => {
      render(
        React.createElement(ThemeProvider, null, React.createElement(Counter))
      );
      // Give effects time to settle
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(renderCount).toBeLessThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Test 2 — Favicon href casing
// Bug Condition: index.html.faviconPath ENDS_WITH ".PNG"
// Expected: link[rel="icon"] href equals /Zinova_logo.png (lowercase)
// ---------------------------------------------------------------------------
describe("Test 2 — Favicon href in index.html", () => {
  it("should have link[rel='icon'] href equal to /Zinova_logo.png (lowercase .png)", () => {
    /**
     * Validates: Requirements 1.4
     *
     * Bug Condition: index.html.faviconHref ENDS_WITH ".PNG"
     *
     * On unfixed code: href="/Zinova_logo.PNG" → 404 on case-sensitive FS.
     * On fixed code: href="/Zinova_logo.png" → resolves correctly.
     */
    const htmlPath = resolve(process.cwd(), "index.html");
    const html = readFileSync(htmlPath, "utf-8");

    // Extract the favicon href using a regex
    const match = html.match(/<link[^>]+rel=["']icon["'][^>]*href=["']([^"']+)["']/);
    const faviconHref = match ? match[1] : null;

    expect(faviconHref).not.toBeNull();
    expect(faviconHref).toBe("/Zinova_logo.png");
    expect(faviconHref).not.toMatch(/\.PNG$/);
  });
});

// ---------------------------------------------------------------------------
// Test 3 — Dashboard token read location
// Bug Condition: Dashboard.tokenRead IS_OUTSIDE useEffect
// Expected: localStorage.getItem("authToken") is NOT called at top level
// ---------------------------------------------------------------------------
describe("Test 3 — Dashboard token read location", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should NOT call localStorage.getItem('authToken') at the top level of the component body", async () => {
    /**
     * Validates: Requirements 1.5
     *
     * Bug Condition: Dashboard.tokenRead IS_OUTSIDE useEffect
     *
     * On unfixed code: const token = localStorage.getItem("authToken") runs
     * synchronously on every render pass (top-level), so getItem is called
     * BEFORE any effects run.
     *
     * On fixed code: the read is inside useEffect, so getItem is NOT called
     * synchronously during the render phase.
     *
     * Strategy: inspect the Dashboard source code to verify the token read
     * is inside a useEffect call, not at the top level of the component body.
     * This is a static analysis approach that avoids render-phase timing issues.
     */
    const dashboardSource = readFileSync(
      resolve(process.cwd(), "src/pages/Dashboard.tsx"),
      "utf-8"
    );

    // On unfixed code: "const token = localStorage.getItem" appears OUTSIDE useEffect
    // On fixed code: the token read is INSIDE the useEffect callback

    // Find the position of localStorage.getItem("authToken")
    const getItemIndex = dashboardSource.indexOf('localStorage.getItem("authToken")');
    expect(getItemIndex).toBeGreaterThan(-1); // must exist somewhere

    // Find the nearest preceding useEffect( to confirm it's inside an effect
    const codeBeforeGetItem = dashboardSource.slice(0, getItemIndex);
    const lastUseEffectIndex = codeBeforeGetItem.lastIndexOf("useEffect(");
    expect(lastUseEffectIndex).toBeGreaterThan(-1); // there must be a useEffect before it

    // Count opening and closing braces between the useEffect( and the getItem call
    // to verify the getItem is inside the useEffect callback (not after it closed)
    const codeBetween = dashboardSource.slice(lastUseEffectIndex, getItemIndex);
    let depth = 0;
    for (const char of codeBetween) {
      if (char === "{") depth++;
      if (char === "}") depth--;
    }
    // If depth > 0, we are still inside the useEffect callback when getItem is called
    expect(depth).toBeGreaterThan(0);
  });
});
