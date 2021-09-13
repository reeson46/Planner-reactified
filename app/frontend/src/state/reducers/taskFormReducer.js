import {TASK_FORM_VISIBILITY, IS_EDIT, GET_TASK_TO_EDIT } from "../action-creators/types";

const initialState = {
  isTaskFormVisible: false,
  isEdit: false,
  taskToEdit:{},
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case TASK_FORM_VISIBILITY:
      return {
        ...state,
        isTaskFormVisible: action.payload
      }
    
    case IS_EDIT:
      return {
        ...state,
        isEdit: action.payload
      }
    
    case GET_TASK_TO_EDIT:
      return {
        ...state,
        taskToEdit: action.payload
      }

    
    default:
      return state
  }
}

export default reducer