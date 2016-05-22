import Sut from './getRecordCreator.js';
import {fromJS, Iterable} from 'immutable';

describe('src/getRecordCreator.js', function() {
    beforeEach(() => {
        this.actual = undefined;
    });
    describe('given any state', () => {
        beforeEach(() => {
            this.state = {
                key: []
            };
        });
        describe('when getting a record creator', () => {
            beforeEach(() => {
                this.actual = Sut(this.state);
            });

            it('it should return a function', () => {
                (typeof this.actual).should.equal('function');
            });
        });

        describe('when creating a record of data for a key not contained within the state', () => {
            beforeEach(() => {
                this.fn = () => Sut(this.state)('missingKey');
            });

            it('it should throw an invariant exception', () => {
                this.fn.should.throw();
            });
        });

        describe('when creating a record from a null or undefined data', () => {
            beforeEach(() => {
                this.fn = () => Sut(this.state)('key');
            });

            it('it should throw an invariant exception', () => {
                this.fn.should.throw();
            });
        });

        describe('when creating a record from a non-object data', () => {
            beforeEach(() => {
                this.fn = () => Sut(this.state)('key', 'not an object');
            });

            it('it should throw an invariant exception', () => {
                this.fn.should.throw();
            });
        });
    });

    describe('given a state without @meta definitions', () => {
        beforeEach(() => {
            this.state = fromJS({
                epics: []
            });
        });
        describe('when creating a record of data for a key contained within the state', () => {
            beforeEach(() => {
                this.actual = Sut(this.state)('epics', {key: 'value'});
            });

            it('it should return the value as an immutable data structure', () => {
                Iterable.isIterable(this.actual).should.be.true;
                this.actual.should.eql(fromJS({key: 'value'}));
            });
        });
    });

    describe('given a state with a matching @meta definition for a provided key', () => {
        beforeEach(() => {
            this.state = fromJS({
                epics: [],
                ['@meta']: {
                    epics: {
                        key: null
                    }
                }
            });
        });
        describe('when creating a record of data for a key contained within the state', () => {
            beforeEach(() => {
                this.actual = Sut(this.state)('epics', {key: 'value'});
            });

            it('it should return an immutable structure for the value', () => {
                Iterable.isIterable(this.actual).should.be.true;
            });

            it('it should return the data as an instance of the @meta definition\'s record', () => {
                this.actual.key.should.equal('value');
            });
        });
    });
});
