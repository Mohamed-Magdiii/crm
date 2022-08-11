import {
  takeEvery, put, call
} from "redux-saga/effects";

// Calender Redux States
import {
  GET_LOGS_START,
  GET_LOGS_END
} from "./actionTypes";

import {
  fetchLogsStart,
  fetchLogsEnd,
} from "./actions";
import * as logsApi from "../../apis/logs";
import { showErrorNotification } from "store/notifications/actions";

function * fetchLogs(params){
  try {
    const data = yield call(logsApi.getLogs, params);  
    yield put(fetchLogsEnd({ data }));
  }
  catch (error){
    yield put(fetchLogsEnd({ error }));
    yield put(showErrorNotification(error.message));
  } 
}

function* logsSaga() {
  yield takeEvery(GET_LOGS_START, fetchLogs);
}

export default logsSaga;
