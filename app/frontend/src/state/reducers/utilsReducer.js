import { RELOAD, UPDATE_DONE } from "../action-creators/types";

const initialState= {
  isReload: false,
  isDone: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RELOAD:
      return {
        ...state,
        isReload: !state.isReload
      }

    case UPDATE_DONE:
      return {
        ...state,
        isDone: true
      }
    
    default:
      return state;
  }
}

export default reducer;