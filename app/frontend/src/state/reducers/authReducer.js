import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  GET_OR_CREATE_USER,
  UPDATE_USER_SUCCESS,
  VERIFY_SUCCESS,
  PASSWORD_RESET_REQUEST_SUCCESS,
  PASSWORD_RESET_SUCCESS,
} from '../action-creators/types'

const initialState = {
  token: localStorage.getItem('token'),
  isLoading: false,
  isRegistered: false,
  isPwdResetLink: false,
  isPWdResetComplete: false,
  isVerified: false,
  user: null
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case GET_OR_CREATE_USER:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      }
    
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
      }
    
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      }
      
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      }
    
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      }
    
    case REGISTER_SUCCESS:
      return {
        ...state,
        isRegistered:true
      }

    case VERIFY_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isVerified:true
      }

    case REGISTER_FAILED:
      return {
        ...state,
        isRegistered: false
      }
    
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isLoading: false,
        isPwdResetLink: false,
        isPWdResetComplete: false,
        isVerified: false,
        isRegistered: false,
        isUpdate: false
      }
    
    case PASSWORD_RESET_REQUEST_SUCCESS:
      return {
        ...state,
        isPwdResetLink: true
      }
    
    case PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isPWdResetComplete: true
      }
    
    default:
      return state
  }
}

export default reducer