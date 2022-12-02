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
