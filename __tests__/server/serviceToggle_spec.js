// Run with `npx jest __tests__/server/serviceToggle_spec.js`

const serviceToggle = require('../../server/serviceToggle.js');

describe('bindAction', () => {
    it('should call app.get with the composed url', () => {
        const app = {
            get: jest.fn()
        };
        const log = {
            info: jest.fn(),
            error: jest.fn()
        };
        const settings = {};
        serviceToggle.bindAction(app,
          'foo',
          log,
          settings,
          'start',
          'started');
        expect(app.get.mock.calls[0][0]).toBe('/foo/start');
    });

    // it('should execute action x for condition y', () => {
    //     const app = {
    //         // TODO mock res
    //         //get: (u, m, callback)
    //     };
    //     const log = {
    //         info: jest.fn(),
    //         error: jest.fn()
    //     };
    //     const settings = {
    //
    //     };
    //     serviceToggle.bindAction(app,
    //       'foo',
    //       log,
    //       settings,
    //       'start',
    //       'started');
    //     // TODO expect app.get() call to cause res() to be called with {status: started}
    //     expect(true).toBeFalsy();
    // });
    //
    // it('should error if no condition met', () => {
    //     // serviceToggle
    //     expect(true).toBeFalsy();
    // });
    //
    // it('should error if errorCode 1 (execPromise)', () => {
    //     // serviceToggle
    //     expect(true).toBeFalsy();
    // });
});
