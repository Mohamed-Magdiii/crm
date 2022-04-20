import * as axiosHelper from "./api_helper";
export const addNewLead = async(values) => {

  const data = await axiosHelper.post("/leads", { ...values });
  if (data.code === 500){
    throw new Error(data.message);
  }
  
  return data;
};
export const fetchLeadsFromAPI = async ( { sizePerPage, currentPage })=>{
  
  const result = await  axiosHelper.get(`/leads?limit=${sizePerPage}&page=${currentPage}`);
  
  return result;
};