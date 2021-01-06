import { expect } from 'chai';
import sinon from 'sinon';
import { periodicize } from '../src/periodicize'

describe('periodicize', function() {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should debounce all calls except the first one', function() {
        const func = sinon.stub();

        const debouncer = periodicize(func, 100, this);

        expect(func.callCount).to.equal(0);
        debouncer();
        expect(func.callCount).to.equal(1);

        debouncer();
        expect(func.callCount).to.equal(1);
        clock.tick(101);
        expect(func.callCount).to.equal(2);

        debouncer();
        expect(func.callCount).to.equal(2);
        clock.tick(101);
        expect(func.callCount).to.equal(3);
    });

    it('should return separate debouncers', function() {
        const func1 = sinon.stub();
        const debouncer1 = periodicize(func1, 100, this);

        const func2 = sinon.stub();
        const debouncer2 = periodicize(func2, 100, this);

        expect(func1.callCount).to.equal(0);
        debouncer1();
        expect(func1.callCount).to.equal(1);

        debouncer1();
        expect(func1.callCount).to.equal(1);
        clock.tick(101);
        expect(func1.callCount).to.equal(2);

        expect(func2.callCount).to.equal(0);
        debouncer2();
        expect(func2.callCount).to.equal(1);

        debouncer2();
        expect(func2.callCount).to.equal(1);
        clock.tick(101);
        expect(func2.callCount).to.equal(2);
    });

    it('should debounce the calls with given interval even if it is called more frequently', () => {
        const func = sinon.stub();
        const debouncer = periodicize(func, 100, this);

        expect(func.callCount).to.equal(0);
        debouncer();
        expect(func.callCount).to.equal(1);

        setTimeout(debouncer, 10);
        setTimeout(debouncer, 20);
        setTimeout(debouncer, 30);
        setTimeout(debouncer, 40);

        expect(func.callCount).to.equal(1);
        clock.tick(111);
        expect(func.callCount).to.equal(2);
        clock.tick(101);
        expect(func.callCount).to.equal(3);
        clock.tick(101);
        expect(func.callCount).to.equal(4);
        clock.tick(101);
        expect(func.callCount).to.equal(5);
    });

    it('should execute all calls with correct arguments', () => {
        const func = sinon.stub();
        const debouncer: Function = periodicize(func, 100, this);

        expect(func.callCount).to.equal(0);
        debouncer(11, '11');
        expect(func.callCount).to.equal(1);

        setTimeout(() => debouncer(22, '22'), 10);
        setTimeout(() => debouncer(33, '33'), 20);
        setTimeout(() => debouncer(44, '44'), 30);

        clock.tick(314);

        sinon.assert.calledWithExactly(func.getCall(0), 11, '11');
        sinon.assert.calledWithExactly(func.getCall(1), 22, '22');
        sinon.assert.calledWithExactly(func.getCall(2), 33, '33');
        sinon.assert.calledWithExactly(func.getCall(3), 44, '44');
    });
});
