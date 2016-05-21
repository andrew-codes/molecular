import * as Sut from './subatomic';

describe('src/subatomic', function() {
    describe('when importing subatomic', () => {
        it('it should contain a createReducer function', () => {
            (typeof Sut.createReducer).should.equal('function');
        });
    });
});
