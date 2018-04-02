// Run with `./node_modules/.bin/jest`

const frisby = require('frisby');
const rp = require('request-promise');

xit('should be a teapot', function (done) {
    frisby.get('http://httpbin.org/status/418')
        .expect('status', 418)
        .done(done);
});

it('should get 200 on login page', function (done) {
    frisby.get('http://localhost:3000')
        //.inspectBody()
        .expect('status', 200)
        .done(done);
});

it('should be the login page', () => {
    expect.assertions(1);
    return rp('http://localhost:3000')
        .then(function(htmlString) {
            // console.log(htmlString);
            // console.log(htmlString.substring('Password'));
            expect(htmlString.indexOf('Password')).toBeGreaterThan(0);
        });
});

it('should get 200 on /fm/list', function (done) {
    frisby.get('http://localhost:3000/fm/list')
    //.inspectBody()
        .expect('status', 200)
        .done(done);
});

it('should redirect /fm/list to the login page', () => {
    expect.assertions(1);
    return rp('http://localhost:3000/fm/list')
        .then(function(htmlString) {
            expect(htmlString.indexOf('Password')).toBeGreaterThan(0);
        });
});
