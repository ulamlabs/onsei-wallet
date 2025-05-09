export const toQueryString = (params: {
  [param: string]:
    | boolean
    | number
    | string
    | (boolean | number | string)[]
    | undefined;
}) => {
  const strParams = Object.fromEntries(
    (
      Object.entries(params).filter(([_, value]) => value !== undefined) as [
        string,
        boolean | number | string,
      ][]
    ).map(([key, value]) => [key, value.toString()]), // convert booleans and numbers to string
  );
  const urlSearchParams = new URLSearchParams(strParams);
  return urlSearchParams.size ? "?" + urlSearchParams : "";
};
