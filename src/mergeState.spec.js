import {Map, List, Set, Iterable, fromJS} from 'immutable';
import Sut from './mergeState.js';
import {should} from 'chai';

describe('src/mergeState.js', function() {
    beforeEach(() => {
        this.actual = undefined;
    });

    describe('given any type of default state', () => {
        beforeEach(() => {
            this.defaultState = {
                items: [],
                selectedItem: null
            };
        });

        describe('when merging with the same state', () => {
            beforeEach(() => {
                this.actual = Sut(this.defaultState, this.defaultState);
            });
            it('should return the provided state', () => {
                this.actual.should.eql(this.defaultState);
            });
        });
    });

    describe('given a POJO default state', () => {
        beforeEach(() => {
            this.defaultState = {
                items: [],
                selectedItem: null
            };
        });

        describe('when merging with a different POJO state', () => {
            beforeEach(() => {
                this.state = {
                    items: [
                        {
                            id: 'Item:1'
                        },
                        {
                            id: 'Item:2'
                        }
                    ],
                    selectedItem: 'Item:2'
                };
                this.expectedState = fromJS(this.defaultState).mergeDeep(this.state);
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should return an immutable state structure', () => {
                Iterable.isIterable(this.actual).should.be.true;
            });

            it('it should deeply merge the default state with the provide state', () => {
                this.actual.should.eql(this.expectedState);
            });
        });
    });

    describe('given an immutable default state with indexed values', () => {
        beforeEach(() => {
            this.defaultState = new Map({
                items: new List(),
                selectedItem: null
            });
        });

        describe('when merging with a different POJO state that does not contain Record @meta definitions', () => {
            beforeEach(() => {
                this.state = {
                    items: [
                        {
                            id: 'Item:1'
                        },
                        {
                            id: 'Item:2'
                        }
                    ],
                    selectedItem: 'Item:2'
                };
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should return an immutable structure', () => {
                Iterable.isIterable(this.actual).should.be.true;
            });
        });

        describe('when merging with a different POJO state that contains any @meta definitions', () => {
            beforeEach(() => {
                this.state = {
                    items: [
                        {
                            id: 'Item:1'
                        },
                        {
                            id: 'Item:2'
                        }
                    ],
                    selectedItem: 'Item:2',
                    '@meta': {
                        items: {
                            id: null
                        }
                    }
                };
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should return state without the @meta definitions as functions to return a Record', () => {
                (typeof this.actual.getIn(['@meta', 'items'])).should.equal('function');
            });
        });

        describe('when merging with a different POJO state with an array that contains @meta definitions', () => {
            beforeEach(() => {
                this.state = {
                    items: [
                        {
                            id: 'Item:1'
                        },
                        {
                            id: 'Item:2'
                        }
                    ],
                    selectedItem: 'Item:2',
                    '@meta': {
                        items: {
                            id: null
                        }
                    }
                };
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should return the arrays as indexed collections', () => {
                Iterable.isIndexed(this.actual.get('items')).should.be.true;
            });

            it('it should return state with its each item transformed into Records based on the matching @meta definition', () => {
                this.actual.get('items').size.should.equal(2);
                this.actual.get('items').forEach((item) => item.id.should.not.be.null);
            });
        });
    });

    describe('given an immutable default state with keyed values', () => {
        beforeEach(() => {
            this.defaultState = new Map({
                items: new Map(),
                selectedItem: null
            });
        });

        describe('when merging with a different POJO state with an object (key/value pair) that contains @meta definitions', () => {
            beforeEach(() => {
                this.state = {
                    items: {
                        'Item:1': {
                            id: 'Item:1'
                        }
                        ,
                        'Item:2': {
                            id: 'Item:2'
                        }
                    },
                    selectedItem: 'Item:2',
                    '@meta': {
                        items: {
                            id: null
                        }
                    }
                };
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should return a keyed Map for the state dictionaries', () => {
                Iterable.isKeyed(this.actual.get('items')).should.be.true;
            });

            it('it should return state with each item in the dictionary transformed into Records based on the matching @meta definition', () => {
                this.actual.get('items').size.should.equal(2);
                this.actual.get('items').forEach((item) => item.id.should.not.be.null);
            });
        });
    });
});
