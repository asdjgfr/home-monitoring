export interface Metric extends Record<string, string | number> {
  instance: string;
  job: string;
  __name__: string;
}

export type Host = {
  metric: Metric;
  value: [number, string];
};
