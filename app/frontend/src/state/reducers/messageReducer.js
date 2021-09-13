import { CLEAR_MSG_ERR, CREATE_MESSAGE, GET_MESSAGES } from '../action-creators/types'

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.payload;

    case CREATE_MESSAGE:
      return (state = action.payload);
    
    case CLEAR_MSG_ERR:
      return initialState

    default:
      return state;
  }
}

export default reducer;