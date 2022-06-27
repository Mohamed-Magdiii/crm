import {
  FETCH_CLIENT_DETAILS_REQUESTED,
  FETCH_CLIENT_DETAILS_SUCCESS,
  FETCH_CLIENT_DETAILS_FAIL,
  FETCH_CLIENT_DETAILS_CLEAR,

  EDIT_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_SUCCESS,
  EDIT_CLIENT_DETAILS_FAIL,
  EDIT_CLIENT_DETAILS_CLEAR,
  FETCH_CLIENT_STAGES_END
} from "./actionsType";

const initalState = {
  error:"",
  loading:true,
  clients:[],
  successMessage:"",
  clientDetails: {},
  editSuccess: false,
  updatedClientDetails: ""
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
        totalDocs:action.payload.newClient ? state.totalDocs + 1 : state.totalDocs,
        clients: action.payload.newClient ? [{ 
          createdAt:new Date().toLocaleDateString(), 
          source:"REGISTER_DEMO",
          category:"LIVE_INDIVIDUAL",
          stages:{
            kycApproved:false,
            kyRejected:false
          },
          ...action.payload.newClient
        },
        ...state.clients] : [...state.clients],
        showAddSuccessMessage:true,
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
        loading: true
      };
      break;
    case EDIT_CLIENT_DETAILS_SUCCESS:
      state = { 
        ...state, 
        updatedClientDetails: action.payload.result,
        editSuccess: true,
        error: false,
        loading: false
      };
      break;
    // TODO check the error message with the backend
    case EDIT_CLIENT_DETAILS_FAIL:
      state = { 
        ...state,
        success: false,
        editError: true,
        EditErrorDetails: action.payload.error,
        loading: false
      };
      break;
    case EDIT_CLIENT_DETAILS_CLEAR:
      state = {
        ...state,
        editSuccess: false,
        error: false
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
    default:
      state = { ...state };
  }
  return state;
};
export default clientReducer;
