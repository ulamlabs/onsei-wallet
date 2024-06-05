import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get<TResponseData = any, TPayload = any>(
  url: string,
  config?: AxiosRequestConfig<TPayload>,
) {
  return api.get<
    TResponseData,
    AxiosResponse<TResponseData, TPayload>,
    TPayload
  >(url, config);
}

type DomainQuota = {
  maxRetryCount: number;
  requestsPerSecond: number;
};

const DEFAULT_QUOTA: DomainQuota = {
  maxRetryCount: 3,
  requestsPerSecond: 2,
};

const domainQuotas: Map<string, DomainQuota> = new Map();
const domainQueues: Map<string, RequestQueue> = new Map();

type RequestQueue = {
  queue: Array<() => void>;
  isProcessing: boolean;
};

function getDomain(url: string): string {
  return new URL(url).hostname;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string | URL | Request,
  options: RequestInit | undefined = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const domain = getDomain(typeof url === "string" ? url : url.toString());

    if (!domainQueues.has(domain)) {
      domainQueues.set(domain, { queue: [], isProcessing: false });
    }

    const requestQueue = domainQueues.get(domain);
    const executeRequest = () => {
      const domainQuota = domainQuotas.get(domain) || DEFAULT_QUOTA;
      fetchWithRetryInternal(url, options, 0, 0, domainQuota.maxRetryCount)
        .then(resolve)
        .catch(reject);
    };

    requestQueue?.queue.push(executeRequest);
    processQueue(domain);
  });
}

async function fetchWithRetryInternal(
  url: string | URL | Request,
  options: RequestInit | undefined,
  retryCount: number,
  delayTime: number,
  maxRetryCount: number,
): Promise<Response> {
  await delay(delayTime);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < maxRetryCount) {
          return fetchWithRetryInternal(
            url,
            options,
            retryCount + 1,
            delayTime * 2,
            maxRetryCount,
          );
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retryCount < maxRetryCount) {
      return fetchWithRetryInternal(
        url,
        options,
        retryCount + 1,
        delayTime * 2,
        maxRetryCount,
      );
    } else {
      throw error;
    }
  }
}

function processQueue(domain: string) {
  const requestQueue = domainQueues.get(domain);
  if (
    !requestQueue ||
    requestQueue.isProcessing ||
    requestQueue.queue.length === 0
  ) {
    return;
  }

  const domainQuota = domainQuotas.get(domain) || DEFAULT_QUOTA;
  const requestInterval = 1000 / domainQuota.requestsPerSecond;

  requestQueue.isProcessing = true;

  const intervalId = setInterval(() => {
    if (requestQueue.queue.length === 0) {
      clearInterval(intervalId);
      requestQueue.isProcessing = false;
      return;
    }

    const request = requestQueue.queue.shift();
    if (request) {
      request();
    }
  }, requestInterval);
}
