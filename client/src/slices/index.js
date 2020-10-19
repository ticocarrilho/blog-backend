import { combineReducers } from 'redux';
import postReducer from './postSlice';
import sessionReducer from './sessionSlice';

const rootReducer = combineReducers({
  post: postReducer,
  session: sessionReducer,
});

export default rootReducer;
