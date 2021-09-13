import { 
  GET_TASKS, 
  ADD_TASK, 
  SET_TASK_STATUS, 
  UPDATE_TASK, 
  DELETE_TASK, 
  INIT_TASKS,
  SET_TASK_EXTEND_STATE,
  SET_SUBTASK_STATE
} from "../action-creators/types";

const initialState = {
  items: []
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case GET_TASKS:
      return {
        ...state,
        items: action.payload
      }
      
    case INIT_TASKS:
      return {
        ...state,
        items: []
      }

    case ADD_TASK:
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case UPDATE_TASK:
      if(action.payload.activeCategory === -1 || 
        action.payload.activeCategory === action.payload.task.category) {
        return {
          ...state,
          items: state.items.map((item => item.id === action.payload.task.id ? action.payload.task : item)
          )
        }
      }
   
      return {
        ...state,
        items: state.items.filter(({ id }) => id !== action.payload.task.id)
      }
    
    case DELETE_TASK:
      return {
        ...state,
        items: state.items.filter(({ id }) => id !== action.payload)
      }

    case SET_TASK_STATUS:
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? {...item, status: action.payload.status} : item)
      }
    
    case SET_TASK_EXTEND_STATE:
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? {...item, extend_state: action.payload.extend} : item)
      }
    
    case SET_SUBTASK_STATE:
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.taskId ? {
        ...item, 
          subtask: item.subtask.map(sub => sub.id === action.payload.subId ? {
            ...sub,
              is_complete: action.payload.subState
          } : sub)
        }
          : item)
      }
    
    default:
        return state;
  }
};

export default reducer;