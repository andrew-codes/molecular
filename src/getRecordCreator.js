import invariant from 'invariant';
import {fromJS, Record} from 'immutable';

export default (state) => (stateKey, value) => {
    invariant(state.has(stateKey), `related state does not include key; ${stateKey}`);
    invariant(value, 'a value must be provided in order to create a record');
    const metaDefinitions = state.get('@meta');
    if (!metaDefinitions) {
        return fromJS(value);
    }
    const stateKeyMetaDefinition = metaDefinitions.get(stateKey);
    if (!stateKeyMetaDefinition) {
        return fromJS(value);
    }
    const StateKeyRecord = Record(stateKeyMetaDefinition.toJS());
    return new StateKeyRecord(value);
}