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

const MAX_RETRY_COUNT = 3;
const REQUESTS_PER_SECOND = 2;
const REQUEST_INTERVAL = 1000 / REQUESTS_PER_SECOND;

type RequestQueue = {
  queue: Array<() => void>;
  isProcessing: boolean;
};

const domainQueues: Map<string, RequestQueue> = new Map();

function processQueue(domain: string) {
  const requestQueue = domainQueues.get(domain);
  if (
    !requestQueue ||
    requestQueue.isProcessing ||
    requestQueue.queue.length === 0
  ) {
    return;
  }

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
  }, REQUEST_INTERVAL);
}

function getDomain(url: string): string {
  const hostname = new URL(url).hostname;
  return hostname;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetryInternal(
  url: string | URL | Request,
  options: RequestInit | undefined,
  retryCount: number,
  delayTime: number,
): Promise<Response> {
  await delay(delayTime);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < MAX_RETRY_COUNT) {
          return fetchWithRetryInternal(
            url,
            options,
            retryCount + 1,
            delayTime * 2,
          );
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retryCount < MAX_RETRY_COUNT) {
      return fetchWithRetryInternal(
        url,
        options,
        retryCount + 1,
        delayTime * 2,
      );
    } else {
      throw error;
    }
  }
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
      fetchWithRetryInternal(url, options, 0, 0).then(resolve).catch(reject);
    };

    requestQueue?.queue.push(executeRequest);
    processQueue(domain);
  });
}
