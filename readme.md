# Molecular-js

## What is it?

Molecular is a set of utilities to ease the development of modular state management patterns with Redux (also known as [ducks](https://github.com/erikras/ducks-modular-redux)). Molecular assumes the usage of at least [Redux](https://github.com/reactjs/redux),  [Reselect](https://github.com/reactjs/reselect) and [Immutable-js](https://github.com/facebook/immutable-js). You may also find a [molecular reference app skeleton](https://github.com/andrew-codes/molecular-reference-app) with additional information on modular state management and how it may look in an application.

## Installation

```bash
npm install molecular-js --save
```

## Usage

### Enhanced Reducer Creation

Vanilla reducers expose a few problems that Molecular attempts to solve; as noted below.

#### Consolidate Switch Statement Logic

A vanilla reducer may look something like:
```javascript
// Reducer.js

export default (state, action) => {
    switch(action.type) {
         case 'actionType1':
            // do something
            return state;
         case 'actionType2':
            // do something
            return state;
         default:
            return state;
    }
};
```

However, the logic to determine which action's reducer function to utilize is duplicated across every reducer. Molecular provides a `createReducer` function that handles this logic in a centralized place.

```javascript
// Reducer.js
import {createReducer} from 'molecular-js';

// Action reducers
const actionReducers = {
    'actionType1': (state, action) => state,
    'actionType2': (state, action) => state
};
const defaultState = {};

export default createReducer(actionReducers, defaultState);
```

#### Proper Merging of Mixture of POJO/Immutable Default and Initial State

When creating a reducer, it is wise to provide it with a default state; which may or may not be an immutable structure. When seeding the store, data from the server is provided as a POJO. Molecular's `createReducer` will accept the mixture of POJO and immutable structures and always seed the store with the output of an immutable structure.

```javascript
// State Atom Reducer
import {Map, Set} from 'immutable';
import {createReducer} from 'molecular-js';

const actionReducers = {
    'actionType1': (state, action) => state // state is immutable
};
const defaultState = new Map({
    items: new Set()
});
export default createReducer(actionReducers, defaultState);

// Store Creation
const initialState = {
    stateAtom: 
        items: [
            {id: 'Item:1'},
            {id: 'Item:2'},
        ]
};
const store = createStore(reducer, initialState);
```

#### Immutable Store, POJO UI
Storing data in the Redux store as immutable structures has one potential downside: do the consumers of state accept immutable structures or POJOs? Forcing the UI to accept immutable structures will make the UI less portable and tightly coupled to Immutable-js. One alternative is to call `.toJS()` on selected state before consuming it in the UI. Although this allows your UI to consume POJOs (and thus be portable), it means that every state change has the potential to deep copy the entirety of the selected state graph.

A solution to this problem is to store data as Immutable Records. This allows the UI to access the immutable structure in the same way it would a POJO. When seeding the store with an initial state, you may optionally provide a Record definition (with data defaults) for each reducer's state atom.

```javascript
const initialState = {
    stateAtom: {
        items: [
            {
                id: 'Item:1',
                name: 'Item name'
            }
        ],
        '@meta': {
            items: {
                id: 'Item:NULL',
                name: null
            }
        }
    }
};

// is equivalent to:
new Map({
    items: new List([
        new (Record({id: 'Item:NULL', name: null})({id: 'Item:1', name: 'Item name'})
    ]),
    '@meta': new Map({
        items: new Map({
            id: 'Item:NULL',
            name: null
        })
    })
});
```

### Automatic Record Creation in Action Reducers

If `@meta` definitions are provided in the initial state for a state atom, then all of the data for the associated definition key will be Immutable Records. Molecular-js provides a mechanism to take POJOs and use the state's provided `@meta` definition to create a Record.

```javascript
// Action Reducer
import {getRecordCreator} from 'molecular-js';

export default {
    'actionType1': (state, action) => {
        const createRecord = getRecordCreator(state);
        return state.updateIn(['items'], (list) => list.concat([
                createRecord('items', action.payload)
            ])
        );
    }
};
```