import { GET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, RENAME_CATEGORY, SET_ACTIVE_CATEGORY, GET_ACTIVE_CATEGORY, INIT_CATEGORIES } from "../action-creators/types";

const initialState = {
  items: [],
  active: 0
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        items: action.payload
      }

    case INIT_CATEGORIES:
      return {
        ...state,
        items: []
      }

    case ADD_CATEGORY:
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case DELETE_CATEGORY:
    return {
      ...state,
      items: state.items.filter(({ id }) => id !== action.payload)
    }

    case RENAME_CATEGORY:
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? {...item, name: action.payload.name} : item)
      }
    
    case GET_ACTIVE_CATEGORY:
      return {
        ...state,
        active: action.payload
      }

    case SET_ACTIVE_CATEGORY:
      return {
        ...state,
        active: action.payload
      }

    default:
        return state;
  }
};

export default reducer;