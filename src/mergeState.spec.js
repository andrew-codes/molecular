import {Map, Set, Iterable} from 'immutable';
import Sut from './mergeState.js';

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

    describe('given an immutable default state and no Record meta definitions', () => {
        beforeEach(() => {
            this.defaultState = new Map({
                items: new Set(),
                selectedItem: null
            });
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

            it('it should return an immutable structure', () => {
                Iterable.isIterable(this.actual).should.be.true;
            });
        });
    });
});
