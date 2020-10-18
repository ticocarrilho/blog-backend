import { combineReducers } from 'redux';
import postReducer from './postSlice';

const rootReducer = combineReducers({
    postReducer
});

export default rootReducer