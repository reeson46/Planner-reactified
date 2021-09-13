import { GET_BOARDS, ADD_BOARD, DELETE_BOARD, SET_ACTIVE_BOARD, GET_ACTIVE_BOARD, RENAME_BOARD, GET_SESSION } from "../action-creators/types";

const initialState = {
  items: [],
  active: 0,
  name: ''
} 

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case GET_BOARDS:
      return {
        ...state,
        items: action.payload
      }
    
    case ADD_BOARD:
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case DELETE_BOARD:
      return {
        ...state,
        items: state.items.filter(({ id }) => id !== action.payload)
      }
    
    case RENAME_BOARD:
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? {...item, name: action.payload.name} : item)
      }

    case GET_ACTIVE_BOARD:
      return {
        ...state,
        active: action.payload,
        name: state.items.find(item => item.id === action.payload).name
      }

    case SET_ACTIVE_BOARD:
      return {
        ...state,
        active: action.payload,
        name: state.items.find(item => item.id === action.payload).name
      }
    
    case GET_SESSION:
    default:
        return state;
  }
};

export default reducer;