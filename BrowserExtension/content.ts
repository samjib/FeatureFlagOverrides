import { Storage } from "@plasmohq/storage";

window.addEventListener("message", async (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type === "request-feature-flags") {
    const storage = new Storage();
    const featureFlags = await storage.get<{ [key: string]: boolean }>("featureFlags");

    window.postMessage({ type: "feature-flags", flags: featureFlags }, "*");
  }

  if (event.data.type === "latest-feature-flags-response") {
    const storage = new Storage();
    await storage.set("latestFeatureFlags", event.data.data);
  }
});
