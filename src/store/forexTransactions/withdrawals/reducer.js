import {
  FETCH_FOREX_WITHDRAWALS_REQUESTED,
  FETCH_FOREX_WITHDRAWALS_SUCCESS,
  FETCH_FOREX_WITHDRAWALS_FAIL,

  ADD_FOREX_WITHDRAWAL_REQUESTED,
  ADD_FOREX_WITHDRAWAL_SUCCESS,
  ADD_FOREX_WITHDRAWAL_FAIL,
  ADD_FOREX_WITHDRAWAL_CLEAR
} from "./actionTypes";

const initalState = {
  forexWithdrawals:[],
  loading:false,
  error:"",
  modalClear:false,
  forexDepositResponseMessage:"",
  addForexWithdrawalClearingCounter: 0,
  disableAddButton: false
};

const forexWithdrawalReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch forex withdrawals
    case FETCH_FOREX_WITHDRAWALS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_FOREX_WITHDRAWALS_SUCCESS:
      state = {
        ...state,
        forexWithdrawals: [...action.payload.result.docs],
        forexTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        loading: false,  
      };
      break;
    case FETCH_FOREX_WITHDRAWALS_FAIL:
      state = {
        ...state,
        loading: false,
        forexWithdrawalError: action.payload
      };
      break;

    // add forex withdrawal
    case ADD_FOREX_WITHDRAWAL_REQUESTED:
      state = {
        ...state,
        loading: true,
        disableAddButton: true
      };
      break;
    case ADD_FOREX_WITHDRAWAL_SUCCESS:
      state = {
        ...state,
        newForexWithdrawal: action.payload.result,
        addforexWithdrawalsuccess: true,
        addForexWithdrawalFail: false,
        loading: false
      };
      break;
    case ADD_FOREX_WITHDRAWAL_FAIL:
      state = {
        ...state,
        addforexWithdrawalsuccess: false,
        addForexWithdrawalFail: true,
        loading: false,
        addForexWithdrawalFailDetails: action.payload.error,
        disableAddButton: false
      };
      break;
    case ADD_FOREX_WITHDRAWAL_CLEAR:
      state = {
        ...state,
        loading: false,
        addForexWithdrawalClearingCounter: state.addForexWithdrawalClearingCounter + 1,
        addForexWithdrawalFail: false,
        addforexWithdrawalsuccess: false,
        modalClear: true,
        disableAddButton: false
      };
      break;
    
    default:
      state = { ...state };
  }
  return state;
};

export default forexWithdrawalReducer;