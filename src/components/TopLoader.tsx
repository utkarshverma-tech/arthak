/**
 * TopLoader — Premium NProgress bar for Arthak
 *
 * Uses router.subscribe events (onBeforeNavigate / onResolved) so the bar
 * fires on EVERY navigation — including simple routes with no data loaders
 * like /login, /dashboard, etc.
 *
 * Features:
 *  - 3px height with a cyan → blue → violet gradient
 *  - Soft glow via box-shadow
 *  - No spinner
 *  - Smooth start / trickle / finish lifecycle
 *  - Fully SSR-safe (useEffect only runs on client)
 */

import { useEffect } from "react";
import NProgress from "nprogress";
import { useRouter } from "@tanstack/react-router";

// ─── NProgress global config ────────────────────────────────────────────────
NProgress.configure({
  minimum: 0.15,
  easing: "ease",
  speed: 360,
  trickle: true,
  trickleSpeed: 250,
  showSpinner: false,
});

// ─── Component ───────────────────────────────────────────────────────────────
export function TopLoader() {
  const router = useRouter();

  useEffect(() => {
    // onBeforeNavigate fires the moment user clicks a link / navigates
    const unsubStart = router.subscribe("onBeforeNavigate", () => {
      NProgress.start();
    });

    // onResolved fires once the new route is fully mounted
    const unsubEnd = router.subscribe("onResolved", () => {
      NProgress.done();
    });

    return () => {
      unsubStart();
      unsubEnd();
      NProgress.done();
    };
  }, [router]);

  return null;
}
