import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { AuthProvider } from "../lib/auth/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import { ArthakLoader } from "../components/auth/ArthakLoader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arthak — Career Operating System" },
      { name: "description", content: "Arthak Career Operating System for Students" },
      { name: "author", content: "Arthak" },
      { property: "og:title", content: "Arthak — Career Operating System" },
      { property: "og:description", content: "Arthak Career Operating System for Students" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Arthak" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isPending = useRouterState({ select: (s) => s.status === "pending" });
  const [mounted, setMounted] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Fetch Interceptor to capture async button calls, API requests, slow internet queries
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      setActiveRequests((prev) => prev + 1);
      try {
        return await originalFetch(...args);
      } finally {
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Debounced loader trigger: delays overlay by 200ms to keep fast clicks/loads snappy,
  // but shows the loader for slow internet, routing transitions, resume processing, or API delays.
  useEffect(() => {
    const needsLoading = isPending || activeRequests > 0;
    
    if (needsLoading) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [isPending, activeRequests]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <AuthModal />
        
        {/* Global Page & API Transition Loader */}
        <AnimatePresence>
          {mounted && showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(250, 247, 242, 0.45)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                pointerEvents: "none", // Never blocks clicks under any circumstances
              }}
            >
              <ArthakLoader size={46} speed={1.0} />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthProvider>
    </QueryClientProvider>
  );
}
