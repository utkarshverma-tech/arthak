export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("Arthak Application Error:", error, context);
}
