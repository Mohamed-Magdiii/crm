import {
  call, put, takeEvery
} from "redux-saga/effects";
import { addNewLead } from "../../apis/lead-api";
import { apiError, addNewLeadSuccess } from "./actions";
import { ADD_NEW_LEAD } from "./actionsType";

function *addNewLeadSaga({ payload:{ newLead } }){
  try {
    const data = yield call(addNewLead, newLead);
    const { status } = data;
    const { code } = data;
      
    if (status === true){
      yield put (addNewLeadSuccess("Lead is added successfully"));
      
    }
    if ( code === 500){
      yield put(apiError("Please Enter Valid Data"));
    }
         
  }
  catch (error){
          
          
    yield put(apiError("Oppos,Error in the server"));
  } 
      
}
function * leadSaga(){
  yield takeEvery(ADD_NEW_LEAD, addNewLeadSaga);
}
export default leadSaga;