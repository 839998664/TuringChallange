import { getVisitors } from '../../api/visitorAPI';
import { LOAD_VISITORS_SUCCESS } from "./actionTypes";
export function loadVisitors(rows) {
    const count = `count=${rows}`;
    return function (dispatch) {
        return getVisitors(count).then(res => res.json()).then((response) => {
            dispatch(loadVisitorsSuccess(response));
        }).catch(err => {
            throw err;
        });
    }

}
export function loadVisitorsSuccess(visitors) {
    return {
        type: LOAD_VISITORS_SUCCESS, visitors
    };
}