import axios from 'axios';
import { returnErrors } from './messageActions'
import { createMessage } from './messageActions';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  GET_OR_CREATE_USER,
  RELOAD,
  UPDATE_USER_SUCCESS,
  UPDATE_DONE,
  VERIFY_SUCCESS,
  PASSWORD_RESET_REQUEST_SUCCESS,
  PASSWORD_RESET_SUCCESS,
  CLEAR_MSG_ERR
} from './types'

// Get user or create guest
export const getOrCreateUser = () => async (dispatch, getState) => {
  try {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const fpRes = await fp.get()
    const body = JSON.stringify({'fp': fpRes.visitorId});

    const res = await axios.post('/api/auth/get-or-create-user/', body, tokenConfig(getState));

    dispatch({
      type: GET_OR_CREATE_USER,
      payload: res.data
    })

    dispatch({
      type: UPDATE_DONE
    })


  } catch(err) {
    await axios.delete('/api/clear-session/', null);
    dispatch({
      type: AUTH_ERROR
    });
    dispatch({
      type: RELOAD
    });  
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Register user
export const register = ({username, email, password}) => async (dispatch, getState) => {

  // body
  const body = JSON.stringify({username, email, password})

  try {
    const res = await axios.post('/api/auth/register/', body, tokenConfig(getState));
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
  } catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
    dispatch({
      type: REGISTER_FAILED
    });
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Verify user
export const verify = (uid, token) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  const body = JSON.stringify({uid, token});
  try {
    const res = await axios.post('/api/auth/verify/', body, config);
    dispatch({
      type: VERIFY_SUCCESS,
      payload: res.data
    });

  }catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Update user
export const updateUser = ({username, email, first_name, last_name, about, password}) => async (dispatch, getState) => {
  const body = JSON.stringify({username, email, first_name, last_name, about, password});
  try {
    const res = await axios.patch('/api/auth/update-user/', body, tokenConfig(getState));
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: res.data
    });
    dispatch(createMessage({
      profileUpdated: 'Profile updated.'
    }));
    
  }catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Login user
export const login = (username, password) => async (dispatch) => {
  // headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  }
  // body
  const body = JSON.stringify({username, password})

  try {
    const res = await axios.post('/api/auth/login/', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

  } catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
    dispatch({
      type: LOGIN_FAILED
    });
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Request password reset email
export const requestPasswordResetEmail = (email) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  const body = JSON.stringify({email});

  try{
    await axios.post('/api/auth/request-password-reset/', body, config);
    dispatch({
      type: PASSWORD_RESET_REQUEST_SUCCESS
    })
  }
  catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Confirm password reset
export const passwordResetConfirm = (uid, token, password) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  const body = JSON.stringify({uid, token, password});
  try {
    await axios.patch('/api/auth/password-reset-confirm/', body, config);
    dispatch({
      type: PASSWORD_RESET_SUCCESS
    });
  }
  catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Logout
export const logout = () => async (dispatch, getState) => {
  
  try {
    await axios.post('/api/auth/logout/', null, tokenConfig(getState));
    dispatch({
      type: LOGOUT_SUCCESS,
    })
    dispatch({
      type: RELOAD,
    });

  } catch(err) {
    dispatch(returnErrors(err.response.data, err.response.status));
    dispatch({
      type: AUTH_ERROR
    });
  }

  dispatch({
    type: CLEAR_MSG_ERR
  });
}

// Setup token config
export const tokenConfig = getState => {
  // get token from state
  const token = getState().auth.token;

  // headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  }

  // if token, add to headers config
  if(token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config
}