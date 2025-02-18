import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toQueryString } from "@/utils/toQueryString";

const apiBaseURL = "https://api.symbiosis.finance/crosschain/";

const api = axios.create({
  baseURL: apiBaseURL,
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
