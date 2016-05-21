import {Iterable, Map, Record} from 'immutable';

export default (defaultState, state) => {
    if (state === defaultState) {
        return state;
    }
    if (Iterable.isIterable(defaultState)) {
        if (!state['@meta']) {
            return defaultState.mergeDeep(state);
        }
        const newState = defaultState.mergeDeep({'@meta': state['@meta']})
            .updateIn(['@meta'], meta => meta.reduce((output, value, key) => output.merge({
                    [key]: ()=> Record(value.toJS())
                })
                , new Map()));
        return newState.map((value, key) => {
            const metaFn = newState.getIn(['@meta', key]);
            if (!metaFn) {
                return value;
            }
            return value.concat(state[key].map((item) => new metaFn()(item)));
        });
    }
    return Object.assign({}, defaultState, state);
};

