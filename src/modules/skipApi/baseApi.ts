import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toQueryString } from "@/utils/toQueryString";

const apiBaseUrl = "https://api.skip.money";

const client_id = "8ea9bfa5-d1ce-4a10-9bbf-fed3f33e795b";

const api = axios.create({
  baseURL: apiBaseUrl,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post<TResponseData = any, TPayload = any>(
  url: string,
  payload: TPayload,
  config?: AxiosRequestConfig<TPayload & { client_id: string }>,
) {
  return api.post<
    TResponseData,
    AxiosResponse<TResponseData, TPayload & { client_id: string }>,
    TPayload & { client_id: string }
  >(url, { client_id, ...payload }, config);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get<TResponseData = any, TPayload = any>(
  url: string,
  params: { [param: string]: boolean | number | string } = {},
  config?: AxiosRequestConfig<TPayload>,
) {
  const queryString = toQueryString({ ...params, client_id });
  return api.get<
    TResponseData,
    AxiosResponse<TResponseData, TPayload>,
    TPayload
  >(url + queryString, config);
}
