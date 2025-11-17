// lib/gtm-types.ts

export interface WindowWithDataLayer extends Window {
  dataLayer: Record<string, any>[];
}

export type GTMEvent = {
  event: "button_click";
  category: "Contact";
  action: "Send Message" | "Call";
  label: string; // To hold the property slug
};
