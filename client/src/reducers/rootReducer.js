import { combineReducers } from 'redux';

import cardReducer from './cardReducer';

const rootReducer = combineReducers({
    cardStore: cardReducer
});

export default rootReducer;
