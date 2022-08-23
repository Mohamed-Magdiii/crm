import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getTodos = async ({ payload }) => {
  const data = await axiosHelper.get(`/todos?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data.result;
};

export const addTodo = async (params) => {
  const { id, ...obj } = params;
  let data;
  if (id) {
    data = data = await axiosHelper.patch(`/todos/${id}`, obj);
  } else {
    data = await axiosHelper.post("/todos", obj);
  }
  if (data.isError) {
    throw new Error(data.message);
  }
  return data.result;
};

export const updateTodo = async (id, params) => {
  // const { id, values } = payload;
  const data = await axiosHelper.post("/todos", params);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data.result;
};

export const deleteTodo = async (id) => {
  // const { id, values } = payload;
  const data = await axiosHelper.del("/todos/" + id);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data.result;
};