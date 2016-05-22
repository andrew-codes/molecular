import {Iterable, Map, Record, fromJS} from 'immutable';

const createRecordFromMeta = (metaFn) => (item) => new metaFn()(item);

export default (defaultState, state) => {
    if (state === defaultState) {
        return state;
    }
    if (Iterable.isIterable(defaultState)) {
        if (!state['@meta']) {
            return defaultState.mergeDeep(state);
        }
        state = fromJS(state)
            .updateIn(['@meta'], meta => meta.reduce((output, value, key) => output.merge({
                    [key]: ()=> Record(value.toJS())
                })
                , new Map()));
        return defaultState.mergeDeep({'@meta': state.get('@meta')})
            .map((value, key) => {
                const metaFn = state.getIn(['@meta', key]);
                if (!metaFn) {
                    return value;
                }
                const createItem = createRecordFromMeta(metaFn);
                if (Iterable.isIndexed(value)) {
                    return value.concat(state.get(key).map(createItem));
                }
                return state.get(key).reduce((output, value, key) => output.mergeDeep({[key]: createItem(value)}), new Map());
            });
    }
    return fromJS(defaultState).mergeDeep(state);
};

