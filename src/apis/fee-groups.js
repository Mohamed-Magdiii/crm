import * as axioHelper from "./api_helper";
import qs from "qs";

export async function fetchFeeGroups (params){
  try {
    const result = await axioHelper.get(`/fee-groups?${qs.stringify(params)}`);
    return result;
  } catch (error){
    throw new Error("Error happened while fetching data");
  }
   

}
export async function updateFeeGroup ({ body, id }){
  const result = await axioHelper.patch(`/fee-groups/${id}`, body);
  if (result.code === 422){
    throw new Error(result.message);
  }
  return result;
}
export async function addFeeGroup (payload){
  const result = await axioHelper.post("/fee-groups", payload);
  if (result.code === 422){
    throw new Error(result.message);
  }
  return result;
  
}
export async function deleteFeeGroup ( id ){
  try {
    const result = await axioHelper.del(`/fee-groups/${id}`);
    return result;
  } catch (error){
    throw new Error("Error happened while deleting data");
  }
}