import { FIRST_ACTION_TYPE } from '../constants/action-types';

export const FIRST_ACTION = data => {
    return {
        type: FIRST_ACTION_TYPE,
        payload: data
    }
}