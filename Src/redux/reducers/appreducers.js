import { FIRST_ACTION_TYPE } from "../constants/action-types";

export const First = (state = [], action) => {
    switch (action.type) {
        case FIRST_ACTION_TYPE:
            return [...state]
        default:
            return state;
    }
};