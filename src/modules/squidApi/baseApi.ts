import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toQueryString } from "@/utils/toQueryString";

const integratorId =
  "sei-bridge-aggregator-1e7f5aee-4f3c-4371-b548-668387ffd5ee";

const apiBaseURL = "https://api.0xsquid.com/v1";

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "X-Integrator-Id": integratorId,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post<TResponseData = any, TPayload = any>(
  url: string,
  payload?: TPayload,
  config?: AxiosRequestConfig<TPayload>,
) {
  return api.post<
    TResponseData,
    AxiosResponse<TResponseData, TPayload>,
    TPayload
  >(url, payload, config);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get<TResponseData = any, TPayload = any>(
  url: string,
  params: { [param: string]: boolean | number | string } = {},
  config?: AxiosRequestConfig<TPayload>,
) {
  return api.get<
    TResponseData,
    AxiosResponse<TResponseData, TPayload>,
    TPayload
  >(url + toQueryString(params), config);
}
