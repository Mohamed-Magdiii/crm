import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import * as clientApi from "apis/client";
import {
  fetchClientsSuccess, 
  apiError, 
  addNewClientSuccess,
  
  fetchClientDetailsSuccess,
  fetchClientDetailsFail,
  fetchClientDetailsClear,

  editClientDetailsSuccess,
  editClientDetailsFail,
  editClientDetailsClear
} from "./actions";
import { 
  ADD_NEW_CLIENT, 
  FETCH_CLIENTS_START,
  
  FETCH_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_REQUESTED
} from "./actionsType";
  
function *fetchClients(params) {
  try {
    const data = yield call(clientApi.getClients, params);
    yield put(fetchClientsSuccess(data));
  } catch (error){
    yield put(apiError, "Oppos there is a problem in the server");
  }
    
}

function * addNewClient({ payload:{ newClient } }) {
  try {
    const data = yield call(clientApi.addClient, newClient);
    const { status } = data;
    if (status){
      yield put(addNewClientSuccess("Client is added successfully", newClient));
    }
  } catch (error){
    yield put(apiError("Invalid data"));
  }
}

function * fetchClientDetails(params){
  try {
    const data = yield call(clientApi.getClientById, params);
    yield put(fetchClientDetailsSuccess(data));
    yield delay(2000);
    yield put(fetchClientDetailsClear());
  } catch (error){
    yield put(fetchClientDetailsFail({ error: error.message }));
  }
}

function * editClientDetails(params){
  try {
    const data = yield call(clientApi.updateClientDetails, params);
    yield put(editClientDetailsSuccess(data));
    yield delay(2000);
    yield put(editClientDetailsClear());
  } catch (error){
    yield put(editClientDetailsFail({ error: error.message }));
  }
}

function * clientSaga() {
  yield takeEvery(FETCH_CLIENTS_START, fetchClients);
  yield takeEvery(ADD_NEW_CLIENT, addNewClient);
  yield takeEvery(FETCH_CLIENT_DETAILS_REQUESTED, fetchClientDetails);
  yield takeEvery(EDIT_CLIENT_DETAILS_REQUESTED, editClientDetails);
}

export default clientSaga;