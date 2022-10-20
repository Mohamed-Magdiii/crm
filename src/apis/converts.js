import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getConverts = async ({ payload }) => {
  const result = await axiosHelper.get(`/convert?${qs.stringify(payload)}`);
  
  return result;
};

export const postConvert = async({ payload }) => {
  const data = await axiosHelper.post("/convert", payload);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};