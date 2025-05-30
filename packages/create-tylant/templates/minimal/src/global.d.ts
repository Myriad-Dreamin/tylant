type ClientEnv = typeof import("astro:env/client");

interface Window {
  postServer(
    url: string,
    opts?: { headers?: Record<string, string>; body?: any; method?: string }
  ): Promise<any>;
}
