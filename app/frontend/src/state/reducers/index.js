import { combineReducers } from "redux";
import taskReducer from "./taskReducer";
import boardReducer  from "./boardReducer"
import categoryReducer from "./categoryReducer";
import taskFormReducer from "./taskFormReducer";
import authReducer from "./authReducer";
import messageReducer from './messageReducer';
import utilsReducer from './utilsReducer';
import errorReducer from './errorReducer';

const reducers = combineReducers({
  board: boardReducer,
  category: categoryReducer,
  task: taskReducer,
  taskForm: taskFormReducer,
  auth: authReducer,
  message: messageReducer,
  utils: utilsReducer,
  error: errorReducer,
})

export default reducers;