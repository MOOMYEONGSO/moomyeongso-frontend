type EventValue = string | number | boolean | null | undefined;
type EventParams = Record<string, EventValue>;
htype ConsentParams = {
  analytics_storage: "granted";
  ad_storage: "denied";
  ad_user_data: "denied";
  ad_personalization: "denied";
  functionality_storage: "granted";
  personalization_storage: "denied";
  security_storage: "granted";
};

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

function buildConsentParams(): ConsentParams {
  return {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  };
}

function initConsent() {
  window.gtag?.("consent", "default", buildConsentParams());
}

export function initGa() {
  if (!GA_ID || gaConfigured) return;

  ensureGtag();
  initConsent();
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
