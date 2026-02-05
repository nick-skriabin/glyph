import ReactReconciler from "react-reconciler";
import { hostConfig } from "./hostConfig.js";

// @ts-expect-error - react-reconciler types don't perfectly match runtime
const reconciler = ReactReconciler(hostConfig);

reconciler.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === "production" ? 0 : 1,
  version: "0.1.0",
  rendererPackageName: "glyph",
});

export { reconciler };
