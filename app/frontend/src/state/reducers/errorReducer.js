import {
  CLEAR_MSG_ERR,
  GET_ERRORS
} from '../action-creators/types'

const initialState = {
  msg: {},
  status: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status
      }
    
    case CLEAR_MSG_ERR:
      return initialState

    default:
      return state;
  }
}

export default reducer;