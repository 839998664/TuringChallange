import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default function visitorsReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.LOAD_VISITORS_SUCCESS:
            return action.visitors;
        default:
            return state;
    }

}