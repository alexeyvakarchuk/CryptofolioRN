// @flow

import { takeEvery, put, call, select } from 'redux-saga/effects';
import { baseURL } from 'config';
import axios from 'axios';
import { createAction, handleActions, combineActions } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import type { State, UserReq } from './types';
import { navigate } from '../navigator';

/**
 * Constants
 * */

export const moduleName: string = 'auth';

export const SIGN_IN_REQUEST: 'AUTH/SIGN_IN_REQUEST' = 'AUTH/SIGN_IN_REQUEST';
export const SIGN_IN_START: 'AUTH/SIGN_IN_START' = 'AUTH/SIGN_IN_START';
export const SIGN_IN_SUCCESS: 'AUTH/SIGN_IN_SUCCESS' = 'AUTH/SIGN_IN_SUCCESS';
export const SIGN_IN_FAIL: 'AUTH/SIGN_IN_FAIL' = 'AUTH/SIGN_IN_FAIL';

export const SIGN_UP_REQUEST: 'AUTH/SIGN_UP_REQUEST' = 'AUTH/SIGN_UP_REQUEST';
export const SIGN_UP_START: 'AUTH/SIGN_UP_START' = 'AUTH/SIGN_UP_START';
export const SIGN_UP_SUCCESS: 'AUTH/SIGN_UP_SUCCESS' = 'AUTH/SIGN_UP_SUCCESS';
export const SIGN_UP_FAIL: 'AUTH/SIGN_UP_FAIL' = 'AUTH/SIGN_UP_FAIL';

export const SIGN_OUT_REQUEST: 'AUTH/SIGN_OUT_REQUEST' = 'AUTH/SIGN_OUT_REQUEST';
export const SIGN_OUT_START: 'AUTH/SIGN_OUT_START' = 'AUTH/SIGN_OUT_START';
export const SIGN_OUT_SUCCESS: 'AUTH/SIGN_OUT_SUCCESS' = 'AUTH/SIGN_OUT_SUCCESS';
export const SIGN_OUT_FAIL: 'AUTH/SIGN_OUT_FAIL' = 'AUTH/SIGN_OUT_FAIL';

export const TOGGLE_FORM_STATE_REQUEST: 'AUTH/TOGGLE_FORM_STATE_REQUEST' =
  'AUTH/TOGGLE_FORM_STATE_REQUEST';
export const TOGGLE_FORM_STATE_START: 'AUTH/TOGGLE_FORM_STATE_START' =
  'AUTH/TOGGLE_FORM_STATE_START';
export const TOGGLE_FORM_STATE_SUCCESS: 'AUTH/TOGGLE_FORM_STATE_SUCCESS' =
  'AUTH/TOGGLE_FORM_STATE_SUCCESS';
export const TOGGLE_FORM_STATE_FAIL: 'AUTH/TOGGLE_FORM_STATE_FAIL' = 'AUTH/TOGGLE_FORM_STATE_FAIL';

/**
 * Reducer
 * */

export const initialState: State = {
  formState: 'SignIn',
  progress: false,
  error: null,
};

const authReducer = handleActions(
  {
    [combineActions(SIGN_IN_START, SIGN_UP_START, SIGN_OUT_START)]: (state: State) => ({
      ...state,
      progress: true,
      error: null,
    }),
    [combineActions(SIGN_IN_SUCCESS, SIGN_UP_SUCCESS)]: () => initialState,
    [SIGN_OUT_SUCCESS]: (state: State) => ({
      ...state,
      progress: false,
      error: null,
    }),
    [TOGGLE_FORM_STATE_SUCCESS]: (state: State, action) => ({
      formState: action.payload.formState,
      progress: false,
      error: null,
    }),
    [combineActions(SIGN_IN_FAIL, SIGN_UP_FAIL, SIGN_OUT_FAIL, TOGGLE_FORM_STATE_FAIL)]: (
      state: State,
      action,
    ) => ({
      ...state,
      progress: false,
      error: action.payload.error,
    }),
  },
  initialState,
);

export default authReducer;

/**
 * Selectors
 * */

export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const signIn = createAction(SIGN_IN_REQUEST);
export const signUp = createAction(SIGN_UP_REQUEST);
export const signOut = createAction(SIGN_OUT_REQUEST);
export const toggleFormState = createAction(TOGGLE_FORM_STATE_REQUEST);

/**
 * Sagas
 * */

/* eslint-disable consistent-return */
export function* signInSaga({
  payload: { email, password },
}: {
  payload: UserReq,
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SIGN_IN_START });

  try {
    const signInRef = {
      method: 'post',
      url: '/sign-in',
      baseURL,
      data: {
        email,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const {
      data: { user },
    } = yield call(axios, signInRef);

    yield put({
      type: SIGN_IN_SUCCESS,
    });

    yield AsyncStorage.setItem('userId', user.id);

    yield put(navigate('CurrenciesListScreen'));
  } catch (res) {
    yield put({
      type: SIGN_IN_FAIL,
      payload: {
        error: res.response.data.error.message,
      },
    });
  }
}

function* signUpSaga({ payload: { email, password } }) {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SIGN_UP_START });

  try {
    const signUpRef = {
      method: 'post',
      url: '/sign-up',
      baseURL,
      data: {
        email,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const {
      data: { user },
    } = yield call(axios, signUpRef);

    yield put({
      type: SIGN_UP_SUCCESS,
    });

    yield put(navigate('CurrenciesListScreen'));

    yield AsyncStorage.setItem('userId', user.id);
  } catch (res) {
    yield put({
      type: SIGN_UP_FAIL,
      payload: { error: res.response.data.error.message },
    });
  }
}

function* signOutSaga() {
  const state = yield select(stateSelector);

  if (state.progress || state.error) return true;

  yield put({ type: SIGN_OUT_START });

  try {
    yield AsyncStorage.removeItem('userId');

    yield put({ type: SIGN_OUT_SUCCESS });

    yield put(navigate('Auth'));
  } catch (error) {
    yield put({
      type: SIGN_OUT_FAIL,
      payload: { error },
    });
  }
}

function* toggleFormStateSaga() {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: TOGGLE_FORM_STATE_START });

  try {
    if (state.formState === 'SignUp') {
      yield put({
        type: TOGGLE_FORM_STATE_SUCCESS,
        payload: {
          formState: 'SignIn',
        },
      });
    } else if (state.formState === 'SignIn') {
      yield put({
        type: TOGGLE_FORM_STATE_SUCCESS,
        payload: {
          formState: 'SignUp',
        },
      });
    }
  } catch (error) {
    yield put({
      type: TOGGLE_FORM_STATE_FAIL,
      payload: { error },
    });
  }
}

export function* watchAuth(): mixed {
  yield takeEvery(SIGN_IN_REQUEST, signInSaga);
  yield takeEvery(SIGN_UP_REQUEST, signUpSaga);
  yield takeEvery(SIGN_OUT_REQUEST, signOutSaga);
  yield takeEvery(TOGGLE_FORM_STATE_REQUEST, toggleFormStateSaga);
}
