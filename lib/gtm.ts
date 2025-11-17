// lib/gtm.ts

import { GTMEvent, WindowWithDataLayer } from "./gtm-types";

export const sendGTMEvent = (event: GTMEvent) => {
  const dataLayer = (window as unknown as WindowWithDataLayer).dataLayer;
  if (dataLayer) {
    dataLayer.push(event);
  }
};
