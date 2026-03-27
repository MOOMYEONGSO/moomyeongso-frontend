type EventValue = string | number | boolean | null | undefined;
type EventParams = Record<string, EventValue>;

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();

let gaConfigured = false;
let lastTrackedPath = "";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
}

function ensureGtagScript(measurementId: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById("ga4-gtag-script")) return;

  const script = document.createElement("script");
  script.id = "ga4-gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function initGa() {
  if (!GA_ID || gaConfigured) return;

  ensureGtag();
  ensureGtagScript(GA_ID);

  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_ID, { send_page_view: false });
  gaConfigured = true;
}

export function trackPageView(path: string) {
  if (!gaConfigured || path === lastTrackedPath) return;

  lastTrackedPath = path;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (!gaConfigured) return;
  window.gtag?.("event", eventName, params);
}
