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

const REQUESTS_PER_SECOND = 30 / 60;
const REQUEST_INTERVAL = 1000 / REQUESTS_PER_SECOND;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string,
  options = {},
  retryCount = 0,
  delayTime = 0,
) {
  await delay(delayTime);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < MAX_RETRY_COUNT) {
          return fetchWithRetry(url, options, retryCount + 1, REQUEST_INTERVAL);
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (retryCount < MAX_RETRY_COUNT) {
      return fetchWithRetry(url, options, retryCount + 1, REQUEST_INTERVAL);
    } else {
      throw error;
    }
  }
}
