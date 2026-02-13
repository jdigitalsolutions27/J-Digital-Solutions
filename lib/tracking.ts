export type ConversionEventName =
  | "book_free_consultation"
  | "view_portfolio"
  | "compare_packages"
  | "request_free_audit";

export function trackConversionEvent(eventName: ConversionEventName, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    ...payload,
    ts: Date.now()
  };

  const anyWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
  };

  if (Array.isArray(anyWindow.dataLayer)) {
    anyWindow.dataLayer.push(eventPayload);
  }

  if (typeof anyWindow.fbq === "function") {
    anyWindow.fbq("trackCustom", eventName, payload);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[tracking]", eventPayload);
  }
}
