import {Iterable} from 'immutable';

export default (defaultState, state) => {
    if (state === defaultState) {
        return state;
    }
    if (Iterable.isIterable(defaultState)) {
        return defaultState.mergeDeep(state);
    }
    return Object.assign({}, defaultState, state);
};

