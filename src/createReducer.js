import mergeState from './mergeState';

export default (actionReducers, defaultState) => {
    defaultState = defaultState || {};
    return (state = defaultState, action) => {
        const mergedState = mergeState(defaultState, state);

        if (!actionReducers.hasOwnProperty(action.type)){
            return mergedState;
        }

        return actionReducers[action.type](mergedState, action);
    };
};