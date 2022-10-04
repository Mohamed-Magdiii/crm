import {
  FETCH_FOREX_DEPOSITS_REQUESTED,
  FETCH_FOREX_DEPOSITS_SUCCESS,
  FETCH_FOREX_DEPOSITS_FAIL,

  ADD_FOREX_DEPOSIT_REQUESTED,
  ADD_FOREX_DEPOSIT_SUCCESS,
  ADD_FOREX_DEPOSIT_FAIL,
  ADD_FOREX_DEPOSIT_CLEAR
} from "./actionTypes";


// fetch forex deposits
export const fetchForexDeposits = (params = {}) => {
  return {
    type: FETCH_FOREX_DEPOSITS_REQUESTED,
    payload: params
  };
};
export const fetchForexDepositsSuccess = (data) => {
  return {
    type: FETCH_FOREX_DEPOSITS_SUCCESS,
    paylad: data
  };
};
export const fetchForexDepositsFail = (error) => {
  return {
    type: FETCH_FOREX_DEPOSITS_FAIL,
    payload: { error }
  };
};

export const addForexDeposit = (params = {}) => {
  return {
    type: ADD_FOREX_DEPOSIT_REQUESTED,
    payload: params
  };
};
export const addForexDepositSuccess = (data) => {
  return {
    type: ADD_FOREX_DEPOSIT_SUCCESS,
    payload: data
  };
};
export const addForexDepositFail = (error) => {
  return {
    type: ADD_FOREX_DEPOSIT_FAIL,
    payload: { error }
  };
};
export const addForexDepositClear = (data) => {
  return {
    type: ADD_FOREX_DEPOSIT_CLEAR,
    payload: data
  };
};