export type Theme = "dark" | "light";

const colors: Record<string, string> = {
  success: "103,194,58",
  info: "144,147,153",
  general: "51,101,255",
  important: "251,238,39",
  serious: "246,140,32",
  danger: "218,67,61",
};

export async function prometheusLoop(fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (e) {
    console.error(e);
  }
  await new Promise((res) => setTimeout(res, 5000));
  requestAnimationFrame(() => prometheusLoop(fn));
}

export function getStatusColor(type: string) {
  return colors[type] ?? colors.general;
}

/**
 * 统一 Grafana 的主题样式
 *
 * @param {HTMLIFrameElement} iframe - Grafana 的 iframe
 * @param {Theme} theme - 当前主题
 */
export function hackGrafanaTheme(iframe: HTMLIFrameElement, theme: Theme) {
  let backgroundColor;
  const iframeDocument = iframe.contentWindow?.document;

  switch (theme) {
    case "light":
      backgroundColor = "rgb(255, 255, 255)";
      break;
    case "dark":
      backgroundColor = "rgb(15, 23, 42)";
      break;
  }
  if (iframeDocument && backgroundColor) {
    iframeDocument.documentElement.classList.add("custom-theme");
    [...iframeDocument.querySelectorAll("style")]
      .at(-1)
      ?.sheet?.insertRule(
        `.custom-theme body,.custom-theme .panel-container{background-color:${backgroundColor};}`
      );
  }
}
