import * as Sut from './molecular';

describe('src/molecular', function() {
    describe('when importing molecular', () => {
        it('it should contain a createReducer function', () => {
            (typeof Sut.createReducer).should.equal('function');
        });

        it('it should contain a getRecordCreator function', () => {
            (typeof Sut.getRecordCreator).should.equal('function');
        });
    });
});
