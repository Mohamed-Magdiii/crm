import {
  PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG 
} from "./actionTypes";

const initialState = {
  rolesPermissions:{},
  userPermissions:{},
  clientPermissions:{},
  leadsPermissions : {},
  teamsPermissions : { },
  depositsPermissions : {},
  withdrawalsPermissions : {},
  feeGroupsPermissions : {},
  dictionariesPermissions : {},
  systemEmailsPermissions : { },
  symbolsPermissions : { },
  currencyPairsPermissions : { },
  markupsPermissions : {},
  orderProfitPermissions: {},
  transactionProfitPermissions: {},
  exchangeBalancePermissions: {},
  requestsPermissions: {},
  error: "",
  success: "",
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        success: action.payload 
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        error: action.payload 
      };
      break;
    case RESET_PROFILE_FLAG :
      state = {
        ...state,
        success: null 
      };
      break;
    case "GET_PROFILE_SUCCESS":
      state = {
        ...state,
        rolesPermissions:{ ...action.payload.roles },
        userPermissions:{ ...action.payload.users },
        clientPermissions : { ...action.payload.clients },
        leadsPermissions : { ...action.payload.leads },
        teamsPermissions : { ...action.payload.teams },
        depositsPermissions : { ...action.payload.deposits },
        withdrawalsPermissions : { ...action.payload.withdrawals },
        feeGroupsPermissions : { ...action.payload.feeGroups },
        dictionariesPermissions : { ...action.payload.dictionaries },
        systemEmailsPermissions : { ...action.payload.systemEmails },
        symbolsPermissions : { ...action.payload.symbols },
        currencyPairsPermissions : { ...action.payload.currencyPairs },
        markupsPermissions : { ...action.payload.markups },
        transactionFeeGroupsPermissions : { ...action.payload.transactionFeeGroups },
        exchangeBalancePermissions : { ...action.payload.exchangeBalance },
        orderProfitPermissions : { ...action.payload.orderProfit },
        transactionProfitPermissions : { ...action.payload.transactionProfit },
        requestsPermissions : { ...action.payload.requests },
      };
      break;
    case "CLEAR_PROFILE":
      state = {
        ...state,
        rolesPermissions:{},
        userPermissions:{},
        clientPermissions:{},
        leadsPermissions : {},
        teamsPermissions : {},
        depositsPermissions : {},
        withdrawalsPermissions : {},
        feeGroupsPermissions : {},
        dictionariesPermissions : {},
        systemEmailsPermissions : { },
        symbolsPermissions : { },
        currencyPairsPermissions : { },
        markupsPermissions : {},
        orderProfitPermissions : {},
        transactionProfitPermissions : {},
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
