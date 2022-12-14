import {
  FETCH_CLIENT_DETAILS_REQUESTED,
  FETCH_CLIENT_DETAILS_SUCCESS,
  FETCH_CLIENT_DETAILS_FAIL,
  FETCH_CLIENT_DETAILS_CLEAR,

  EDIT_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_SUCCESS,
  EDIT_CLIENT_DETAILS_FAIL,
  EDIT_CLIENT_DETAILS_CLEAR,
  FETCH_CLIENT_STAGES_END,
  UPDATE_FINANCIAL_INFO_START,
  UPDATE_EMPLOYMENT_INFO_START,
  UPDATE_EMPLOYMENT_INFO_SUCCESS,
  UPDATE_FINANCIAL_INFO_SUCCESS,
  UPDATE_FINANCIAL_INFO_FAIL,
  UPDATE_EMPLOYMENT_INFO_FAIL,
  RESET_PASSWORD_CLEAR,
  CHANGE_PASSWORD_START,
  SEND_EMAIL_TO_RESET_PASSWORD_START,
  SEND_EMAIL_MODAL_CLEAR,
  CLIENT_FORGOT_PASSWORD_START,
  CLIENT_FORGOT_PASSWORD_CLEAR,
  CLIENT_DISABLE_2FA_START,
  CLIENT_DISABLE_2FA_SUCCESS,
  CLIENT_DISABLE_2FA_FAIL,
} from "./actionsType";

const initalState = {
  error:"",
  loading:false,
  clients:[],
  successMessage:"",
  clientDetails: {},
  editSuccess: false,
  updatedClientDetails: "",
  disable2FA:{
    loading:false
  }
};

export const clientReducer = (state = initalState, action)=>{
  switch (action.type){
    case "FETCH_CLIENTS_START":
      state = {
        ...state,
        loading:true,
        
      };
      break;
    case "FETCH_CLIENTS_SUCCESS":
      state = {
        ...state,
        clients: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        loading: false           
      };
      break;
    case "ADD_NEW_CLIENT":
      state = {
        ...state,
        error:"",
        successMessage:""
      };
    
      break;
    case "ADD_NEW_CLIENT_SUCCESS":
      state = {
        ...state,
        loading: false,
        totalDocs:state.totalDocs + 1,
        clients: action.payload ? [{ 
          ...action.payload
        },
        ...state.clients] : [...state.clients],
        disableAddButton:true
      };
      break;
    case "ADD_MODAL_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage:false,
        disableAddButton:false
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        loading:false,
        error:action.payload.error
      };
      break;
    case UPDATE_FINANCIAL_INFO_SUCCESS:
      state = {
        ...state,
        clients : state.clients.map((client)=>{
          if (client._id === action.payload.id){
            return {
              ...client, 
              financialInfo: { ...action.payload.financialInfo }
            };
          }
          else {
            return client;
          }

        }),
        financialInfoUpdating:false
      };
      break;
    case UPDATE_EMPLOYMENT_INFO_SUCCESS:
      state = {
        ...state,
        clients: state.clients.map((client)=>{
          if (client._id === action.payload.id){
            return {
              ...client,
              experience:{ ...action.payload.values }
            };
          }
          else {
            return client;
          }
        }),
        employmentInfoUpdating:false
       
      };
      break;
    // fetch client details
    case FETCH_CLIENT_DETAILS_REQUESTED:
      state = {
        ...state,
        clientProfileloading: true
      };
      break;
    case FETCH_CLIENT_DETAILS_SUCCESS:
      state = {
        ...state,
        error: false,
        success: true,
        clientDetails: action.payload.result,
        clientProfileloading: false,
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        addError: false
      };
      break;
    case FETCH_CLIENT_DETAILS_FAIL:
      state = {
        ...state,
        clientProfileError: true,
        editSuccess:false,
        clientProfileloading: false
      };
      break;
    case FETCH_CLIENT_DETAILS_CLEAR:
      state = {
        ...state
      };
      break;

    // update client details
    case EDIT_CLIENT_DETAILS_REQUESTED:
      state = {
        ...state,
        updating: true,
        editSuccess:false,
        showPortalAccessModal:true
      };

      break;
    case UPDATE_EMPLOYMENT_INFO_START:
      state = {
        ...state,
        employmentInfoUpdating:true
      };
      break;
    case UPDATE_EMPLOYMENT_INFO_FAIL:
      state = {
        ...state,
        employmentInfoUpdating:false
      };
      break;
    case UPDATE_FINANCIAL_INFO_START:
      state = {
        ...state,
        financialInfoUpdating:true
      };
      break;
    case UPDATE_FINANCIAL_INFO_FAIL:
      state = {
        ...state,
        financialInfoUpdating:false
      };
      break;
    case EDIT_CLIENT_DETAILS_SUCCESS:
      state = { 
        ...state, 
        clientDetails: {
          ...state.clientDetails,
          ...action.payload
        },
        editSuccess: true,
        error: false,
        updating: false,
        showPortalAccessModal:false
      };
      break;
    case CHANGE_PASSWORD_START:
      state = {
        ...state,
        clearResetPasswordModal:false,
        disableResetPasswordButton: true
      };
      break;
    case RESET_PASSWORD_CLEAR:
      state = {
        ...state,
        clearResetPasswordModal:true,
        disableResetPasButton:false
      };
      break;
    case CLIENT_FORGOT_PASSWORD_START:
      state = { 
        ...state,
        disableSendEmailButton: true,
        clearResetPasswordModal: false,
      };
      
      break;
    case CLIENT_FORGOT_PASSWORD_CLEAR:
      state = {
        ...state,
        disableSendEmailButton: false,
        clearResetPasswordModal: true
      };
      break;
    // TODO check the error message with the backend
    case EDIT_CLIENT_DETAILS_FAIL:
      state = { 
        ...state,
        success: false,
        editError: true,
        EditErrorDetails: action.payload.error,
        updating: false
      };
      break;
    case EDIT_CLIENT_DETAILS_CLEAR:
      state = {
        ...state,
        editSuccess: false,
        editError: false
      };
      break;
    case FETCH_CLIENT_STAGES_END:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          stages: action.payload
        }
      };
      break;
    case "ASSIGN_AGENT_SUCCESS":
      state = {
        ...state,
        clients : state.clients.map(client=>{
          for (let i = 0 ; i < action.payload.clientIds.length; i++){
            if (client._id === action.payload.clientIds[i]){
              return {
                ...client,
                agent:{
                  ...action.payload.agent
                }
              };
            }
          }
       
          
          return client;
          
        })
      };
      break;
    case CLIENT_DISABLE_2FA_START:
      return {
        ...state,
        disable2FA: {
          loading:true,
          success: false,
        }
      };
    case CLIENT_DISABLE_2FA_SUCCESS:
      return {
        ...state,
        disable2FA:{
          loading: false,
          success: true,
        }
      };
    case CLIENT_DISABLE_2FA_FAIL:
      return {
        ...state,
        disable2FA:{
          loading:false,
          success:false
        }
      };
    default:
      state = { ...state };
  }
  return state;
};
export default clientReducer;
