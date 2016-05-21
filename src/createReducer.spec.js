import Sut, {__RewireAPI__ as Rewire} from './createReducer';
import {stub} from 'sinon';

describe('src/createReducer.js', function() {
    beforeEach(() => {
        this.actual = undefined;
    });
    describe('when creating the reducer', () => {
        beforeEach(() => {
            this.actual = Sut({}, {});
        });
        it('it should return a function', () => {
            (typeof this.actual).should.equal('function');
        });
    });

    describe('given a reducer with no default state', () => {
        beforeEach(() => {
            this.defaultState = {};
            this.sut = Sut({});
        });

        describe('when invoking the reducer', () => {
            beforeEach(() => {
                this.mergeState = stub().returns({});
                Rewire.__Rewire__('mergeState', this.mergeState);
                this.actual = this.sut({}, {type: 'my-action'});
            });

            it('it should call mergeState with a defaultState of an empty object and not null', () => {
                this.mergeState.calledWith({}, {}).should.be.true;
            });
        });
    });

    describe('given a reducer with no action reducers', () => {
        beforeEach(() => {
            this.actionReducers = {};
            this.defaultState = {
                state: 'something'
            };
            this.sut = Sut(this.actionReducers, this.defaultState);
        });

        describe('when invoking the created reducer with an action', () => {
            beforeEach(() => {
                this.action = {type: 'actionName'};
                this.mergedState = {
                    merged: 'state'
                };
                this.mergeState = stub().withArgs(this.defaultState, this.state).returns(this.mergedState);
                Rewire.__Rewire__('mergeState', this.mergeState);
                this.actual = this.sut(this.state, this.action)
            });

            it('it should return the merged default state and provided state', () => {
                this.actual.should.equal(this.mergedState);
            });
        });
    });

    describe('given a reducer with action reducers', () => {
        beforeEach(() => {
            this.mutatedState = {
                mutated: "state"
            };
            this.actionReducers = {
                'actionName': () => {
                    return this.mutatedState;
                }
            };
            this.defaultState = {
                state: 'something'
            };
            this.sut = Sut(this.actionReducers, this.defaultState);
        });

        describe('when invoking the created reducer with an action not matching any action reducer', () => {
            beforeEach(() => {
                this.action = {type: 'a non matching action'};
                this.mergedState = {
                    merged: 'state'
                };
                this.mergeState = stub().withArgs(this.defaultState, this.state).returns(this.mergedState);
                Rewire.__Rewire__('mergeState', this.mergeState);
                this.actual = this.sut(this.state, this.action)
            });

            it('it should return the merged default state and provided state', () => {
                this.actual.should.equal(this.mergedState);
            });
        });

        describe('when invoking the reducer with an action matching an action reducer', () => {
            beforeEach(() => {
                this.action = {type: 'actionName'};
                this.actual = this.sut(this.state, this.action);
            });
            it('it should return the state returned from the matching action reducer method', () => {
                this.actual.should.eql(this.mutatedState);
            });
        });
    });

});
