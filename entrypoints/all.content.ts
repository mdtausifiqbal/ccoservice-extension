import { copyToClipboard } from "@/utils/functions";

function handleIframeMessage(event: MessageEvent) {
  if (event.data.action === "COPY_TO_CLIPBOARD") {
    const text = event.data.payload;

    if (event.data.source !== "ccoservice") return;

    copyToClipboard(text)
      .then(() => {
        console.log("copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard", err);
      });
  }
}

export default defineContentScript({
  matches: ["*://*/*"], // The external website hosting the iframe
  allFrames: true,
  main(ctx) {
    ctx.addEventListener(window, "message", handleIframeMessage);
  },
});
