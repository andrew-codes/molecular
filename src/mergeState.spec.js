import {Map, Set, Iterable} from 'immutable';
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
                this.actual = Sut(this.defaultState, this.state);
            });

            it('it should deeply merge the default state with the provide state', () => {
                this.actual.should.eql(this.state);
            });
        });
    });

    describe('given an immutable default state', () => {
        beforeEach(() => {
            this.defaultState = new Map({
                items: new Set(),
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

            it('it should return state with its data transformed into Records based on the matching @meta definition', () => {
                this.actual.get('items').size.should.equal(2);
                this.actual.get('items').forEach((item) => item.id.should.not.be.null);
            });
        });
    });
});
